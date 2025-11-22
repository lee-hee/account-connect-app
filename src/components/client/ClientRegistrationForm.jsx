import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, User, Home, Briefcase, CheckCircle, DollarSign, FileCheck, Loader2, LogOut } from 'lucide-react';
import { useFormData } from '../../hooks/useFormData';
import { validateStep } from '../../utils/validation';
import ProgressSteps from './ProgressSteps';
import PersonalInfoStep from './steps/PersonalInfoStep';
import FinancialDetailsStep from './steps/FinancialDetailsStep';
import AddressStep from './steps/AddressStep';
import FamilyStep from './steps/FamilyStep';
import BusinessEntitiesStep from './steps/BusinessEntitiesStep';
import PreviewStep from './steps/PreviewStep';
import AgreementsStep from './steps/AgreementsStep';
import { registerClient, saveStepData, getClientById } from '../../services/api';

// FIX: Changed parameter name from 'user' to 'userData' to match App.js usage
const ClientRegistrationForm = ({ userData, onRegistrationComplete, onLogout }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastSavedStepName, setLastSavedStepName] = useState('');
  const { formData, setFormData, handleInputChange } = useFormData();

  // Load existing client data if clientId exists
  useEffect(() => {
    const loadClientData = async () => {
      // FIX: Changed 'user' to 'userData' to match the prop name
      if (userData?.clientId) {
        const result = await getClientById(userData.clientId);
        if (result.success && result.data) {
          // Populate form with existing data
          setFormData(prev => ({
            ...prev,
            clientId: userData.clientId,
            ...result.data
          }));
        }
      } else {
        // Set clientId if user doesn't have one yet
        setFormData(prev => ({
          ...prev,
          email: userData?.email // Pre-fill email from login
        }));
      }
    };

    loadClientData();
    // FIX: Updated dependencies to use userData instead of user
  }, [userData?.clientId, userData?.email, setFormData]);

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Financial Details', icon: DollarSign },
    { number: 3, title: 'Address & Residency', icon: Home },
    { number: 4, title: 'Family Details', icon: User },
    { number: 5, title: 'Business Entities', icon: Briefcase },
    { number: 6, title: 'Review', icon: CheckCircle },
    { number: 7, title: 'Agreements', icon: FileCheck }
  ];

  const handleNext = async () => {
    if (!validateStep(currentStep, formData, setErrors)) {
      return;
    }

    // Skip saving for step 5 (Business Entities) - entities are saved individually
    if (currentStep === 5) {
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');
    setErrorMessage(null);

    const saveResult = await saveStepData(formData, currentStep);

    if (saveResult.success) {
      setSaveStatus('saved');
      setErrorMessage(null);

      // Save the step name for display
      const stepName = steps.find(s => s.number === currentStep)?.title || `Step ${currentStep}`;
      setLastSavedStepName(stepName);

      console.log(`✅ Step ${currentStep} data saved successfully`);

      // If this is step 1 (Personal Info), store the clientId
      if (currentStep === 1 && saveResult.clientId) {
        console.log(`📝 Client ID received: ${saveResult.clientId}`);
        setFormData(prev => ({
          ...prev,
          clientId: saveResult.clientId
        }));
      }

      setTimeout(() => setSaveStatus(null), 2000);

      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setSaveStatus('error');
      console.error('❌ Save failed - Full response:', JSON.stringify(saveResult, null, 2));

      // Save the step name for display
      const stepName = steps.find(s => s.number === currentStep)?.title || `Step ${currentStep}`;
      setLastSavedStepName(stepName);

      // Extract error message from backend response with deep search
      let displayError = 'Failed to save. Please check your information and try again.';

      // Helper function to deeply search for _embedded.errors
      const findEmbeddedErrors = (obj) => {
        if (!obj) return null;

        // Direct check
        if (obj._embedded && obj._embedded.errors && Array.isArray(obj._embedded.errors)) {
          return obj._embedded.errors;
        }

        // Check in error property
        if (obj.error && obj.error._embedded && obj.error._embedded.errors && Array.isArray(obj.error._embedded.errors)) {
          return obj.error._embedded.errors;
        }

        // Check in data property (some APIs wrap response in data)
        if (obj.data && obj.data._embedded && obj.data._embedded.errors && Array.isArray(obj.data._embedded.errors)) {
          return obj.data._embedded.errors;
        }

        return null;
      };

      const embeddedErrors = findEmbeddedErrors(saveResult);

      if (embeddedErrors && embeddedErrors.length > 0) {
        const errorMessages = embeddedErrors
            .map(err => err.message)
            .filter(msg => msg)
            .map(msg => {
              // Extract the actual error message after the colon
              const parts = msg.split(': ');
              return parts.length > 1 ? parts[1] : msg;
            });

        // Join multiple errors with bullet points for better readability
        if (errorMessages.length > 1) {
          displayError = errorMessages.map(msg => `• ${msg}`).join('\n');
        } else if (errorMessages.length === 1) {
          displayError = errorMessages[0];
        }
      } else {
        // Fallback to other message sources (but not "Bad Request")
        const errorObj = saveResult.error || saveResult.data || saveResult;

        if (errorObj.message && errorObj.message !== 'Bad Request') {
          displayError = errorObj.message;
        } else if (typeof errorObj === 'string') {
          displayError = errorObj;
        } else if (saveResult.message && saveResult.message !== 'Bad Request') {
          displayError = saveResult.message;
        }
      }

      setErrorMessage(displayError);

      setTimeout(() => {
        setSaveStatus(null);
        setErrorMessage(null);
      }, 5000);

      // For step 1, don't proceed if save failed
      if (currentStep === 1) {
        setIsSaving(false);
        return;
      }

      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
      }
    }

    setIsSaving(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep, formData, setErrors)) {
      setIsSaving(true);
      setSaveStatus('saving');
      setErrorMessage(null);

      const result = await registerClient(formData);

      if (result.success) {
        console.log('✅ Registration completed successfully');
        setSaveStatus('completed');
        setErrorMessage(null);

        // Call the completion callback to update user status
        if (onRegistrationComplete) {
          onRegistrationComplete();
        }
      } else {
        console.error('❌ Registration failed - Full response:', JSON.stringify(result, null, 2));
        setSaveStatus('error');

        // Extract error message from backend response with deep search
        let displayError = 'Registration failed. Please check your information and try again.';

        // Helper function to deeply search for _embedded.errors
        const findEmbeddedErrors = (obj) => {
          if (!obj) return null;

          // Direct check
          if (obj._embedded && obj._embedded.errors && Array.isArray(obj._embedded.errors)) {
            return obj._embedded.errors;
          }

          // Check in error property
          if (obj.error && obj.error._embedded && obj.error._embedded.errors && Array.isArray(obj.error._embedded.errors)) {
            return obj.error._embedded.errors;
          }

          // Check in data property (some APIs wrap response in data)
          if (obj.data && obj.data._embedded && obj.data._embedded.errors && Array.isArray(obj.data._embedded.errors)) {
            return obj.data._embedded.errors;
          }

          return null;
        };

        const embeddedErrors = findEmbeddedErrors(result);

        if (embeddedErrors && embeddedErrors.length > 0) {
          const errorMessages = embeddedErrors
              .map(err => err.message)
              .filter(msg => msg)
              .map(msg => {
                // Extract the actual error message after the colon
                const parts = msg.split(': ');
                return parts.length > 1 ? parts[1] : msg;
              });

          // Join multiple errors with bullet points for better readability
          if (errorMessages.length > 1) {
            displayError = errorMessages.map(msg => `• ${msg}`).join('\n');
          } else if (errorMessages.length === 1) {
            displayError = errorMessages[0];
          }
        } else {
          // Fallback to other message sources (but not "Bad Request")
          const errorObj = result.error || result.data || result;

          if (errorObj.message && errorObj.message !== 'Bad Request') {
            displayError = errorObj.message;
          } else if (typeof errorObj === 'string') {
            displayError = errorObj;
          } else if (result.message && result.message !== 'Bad Request') {
            displayError = result.message;
          }
        }

        setErrorMessage(displayError);

        setTimeout(() => {
          setSaveStatus(null);
          setErrorMessage(null);
        }, 5000);
      }

      setIsSaving(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with Logout */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {/* FIX: Changed userData.email from user.email */}
              Logged in as: <span className="font-medium">{userData?.email}</span>
            </div>
            <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Registration</h1>
            <p className="text-gray-600">Please complete all sections to finish your registration</p>

            {/* Fixed height container to prevent jumpiness */}
            <div className="mt-4 min-h-[80px] flex items-center justify-center">
              {saveStatus && (
                  <div className={`inline-flex flex-col items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 max-w-2xl w-full ${
                      saveStatus === 'saving' ? 'bg-blue-100 text-blue-800' :
                          saveStatus === 'saved' ? 'bg-green-100 text-green-800' :
                              saveStatus === 'error' ? 'bg-red-100 text-red-800' :
                                  saveStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-center">
                      {saveStatus === 'saving' && (
                          <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Saving {steps.find(s => s.number === currentStep)?.title || `Step ${currentStep}`}...
                          </>
                      )}
                      {saveStatus === 'saved' && (
                          <>
                            <CheckCircle className="mr-2" size={16} />
                            {lastSavedStepName} saved successfully
                          </>
                      )}
                      {saveStatus === 'error' && (
                          <>
                            ⚠️ {lastSavedStepName} - Save failed
                          </>
                      )}
                      {saveStatus === 'completed' && (
                          <>
                            <CheckCircle className="mr-2" size={16} />
                            Registration completed!
                          </>
                      )}
                    </div>
                    {errorMessage && saveStatus === 'error' && (
                        <div className="mt-3 text-xs w-full text-left whitespace-pre-line bg-red-50 p-3 rounded border border-red-200">
                          {errorMessage}
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>

          <ProgressSteps steps={steps} currentStep={currentStep} />

          <div className="bg-white rounded-lg shadow-lg p-8 max-h-[600px] overflow-y-auto">
            <div>
              {currentStep === 1 && (
                  <PersonalInfoStep
                      formData={formData}
                      errors={errors}
                      handleInputChange={(e) => handleInputChange(e, setErrors)}
                  />
              )}

              {currentStep === 2 && (
                  <FinancialDetailsStep
                      formData={formData}
                      errors={errors}
                      handleInputChange={(e) => handleInputChange(e, setErrors)}
                  />
              )}

              {currentStep === 3 && (
                  <AddressStep
                      formData={formData}
                      errors={errors}
                      handleInputChange={(e) => handleInputChange(e, setErrors)}
                  />
              )}

              {currentStep === 4 && (
                  <FamilyStep
                      formData={formData}
                      handleInputChange={(e) => handleInputChange(e, setErrors)}
                  />
              )}

              {currentStep === 5 && (
                  <BusinessEntitiesStep
                      formData={formData}
                      setFormData={setFormData}
                  />
              )}

              {currentStep === 6 && (
                  <PreviewStep
                      formData={formData}
                  />
              )}

              {currentStep === 7 && (
                  <AgreementsStep
                      formData={formData}
                      errors={errors}
                      handleInputChange={(e) => handleInputChange(e, setErrors)}
                  />
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                        currentStep === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Previous
                </button>

                {currentStep < 7 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSaving}
                        className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                            isSaving
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white`}
                    >
                      {isSaving ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Saving...
                          </>
                      ) : (
                          <>
                            Next
                            <ChevronRight size={20} className="ml-2" />
                          </>
                      )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                            isSaving
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                    >
                      {isSaving ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Submitting...
                          </>
                      ) : (
                          <>
                            Submit Registration
                            <CheckCircle size={20} className="ml-2" />
                          </>
                      )}
                    </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-600 text-sm">
            Step {currentStep} of 7
          </div>
        </div>
      </div>
  );
};

export default ClientRegistrationForm;