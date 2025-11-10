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

const ClientRegistrationForm = ({ user, onRegistrationComplete, onLogout }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const { formData, setFormData, handleInputChange } = useFormData();

  // Load existing client data if clientId exists
  useEffect(() => {
    const loadClientData = async () => {
      if (user.clientId) {
        const result = await getClientById(user.clientId);
        if (result.success && result.data) {
          // Populate form with existing data
          setFormData(prev => ({
            ...prev,
            clientId: user.clientId,
            ...result.data
          }));
        }
      } else {
        // Set clientId if user doesn't have one yet
        setFormData(prev => ({
          ...prev,
          email: user.email // Pre-fill email from login
        }));
      }
    };

    loadClientData();
  }, [user.clientId, user.email, setFormData]);

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

    const saveResult = await saveStepData(formData, currentStep);

    if (saveResult.success) {
      setSaveStatus('saved');
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
      console.error('❌ Save failed:', saveResult.error);

      setTimeout(() => setSaveStatus(null), 3000);

      // For step 1, don't proceed if save failed
      if (currentStep === 1) {
        alert('Failed to save personal information. Please try again.');
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

      const result = await registerClient(formData);

      if (result.success) {
        console.log('✅ Registration completed successfully');
        setSaveStatus('completed');

        // Call the completion callback to update user status
        if (onRegistrationComplete) {
          onRegistrationComplete();
        }

        setTimeout(() => {
          alert('Registration completed successfully! Redirecting to dashboard...');
        }, 500);
      } else {
        console.error('❌ Registration failed:', result.error);
        setSaveStatus('error');
        alert(`Registration failed: ${result.message}`);
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
              Logged in as: <span className="font-medium">{user.email}</span>
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

            {saveStatus && (
                <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                    saveStatus === 'saving' ? 'bg-blue-100 text-blue-800' :
                        saveStatus === 'saved' ? 'bg-green-100 text-green-800' :
                            saveStatus === 'error' ? 'bg-red-100 text-red-800' :
                                saveStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                }`}>
                  {saveStatus === 'saving' && (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Saving...
                      </>
                  )}
                  {saveStatus === 'saved' && (
                      <>
                        <CheckCircle className="mr-2" size={16} />
                        Saved successfully
                      </>
                  )}
                  {saveStatus === 'error' && (
                      <>
                        ⚠️ Save failed (continuing anyway)
                      </>
                  )}
                  {saveStatus === 'completed' && (
                      <>
                        <CheckCircle className="mr-2" size={16} />
                        Registration completed!
                      </>
                  )}
                </div>
            )}
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