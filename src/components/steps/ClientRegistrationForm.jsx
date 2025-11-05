import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, User, Home, Briefcase, CheckCircle, DollarSign, FileCheck } from 'lucide-react';
import { useFormData } from '../hooks/useFormData';
import { validateStep } from '../utils/validation';
import ProgressSteps from './ProgressSteps';
import PersonalInfoStep from './steps/PersonalInfoStep';
import FinancialDetailsStep from './steps/FinancialDetailsStep';
import AddressStep from './steps/AddressStep';
import FamilyStep from './steps/FamilyStep';
import BusinessEntitiesStep from './steps/BusinessEntitiesStep';
import AgreementsStep from './steps/AgreementsStep';
import { registerClient } from '../services/api';

const ClientRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const { formData, setFormData, handleInputChange } = useFormData();

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Financial Details', icon: DollarSign },
    { number: 3, title: 'Address & Residency', icon: Home },
    { number: 4, title: 'Family Details', icon: User },
    { number: 5, title: 'Business Entities', icon: Briefcase },
    { number: 6, title: 'Agreements', icon: FileCheck }
  ];

  const handleNext = () => {
    if (validateStep(currentStep, formData, setErrors) && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep, formData, setErrors)) {
     //setIsSubmitting(true);
    const result = await registerClient(formData); // ← API CALL HERE!
      
      if (result.success) {
         console.log('all good :');
      } else {
         console.log('bad good :');
      }
      
     // setIsSubmitting(false);
        }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Client Registration</h1>
          <p className="text-gray-600">Please complete all sections to register a new client</p>
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

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
                >
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                >
                  Submit Registration
                  <CheckCircle size={20} className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-600 text-sm">
          Step {currentStep} of 6
        </div>
      </div>
    </div>
  );
};

export default ClientRegistrationForm;
