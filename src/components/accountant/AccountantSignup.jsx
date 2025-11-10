import React, { useState } from 'react';
import { AlertCircle, CheckCircle, ChevronRight, ChevronLeft, Loader2, Shield, Mail, FileCheck } from 'lucide-react';
import {
  registerAccountant
} from '../../services/api';
import PasswordSetup from '../PasswordSetup';

/**
 * Accountant Registration Component
 *
 * This is a 4-step registration form that collects all data on the frontend
 * and sends it as a single "accountantRegisterDTO" to the backend at step 3.
 *
 * Step 1: Personal Details (firstName, lastName, email, phone)
 * Step 2: Password Setup (password, confirmPassword)
 * Step 3: Tax Practitioner Registration (businessName, registrationNumber, address)
 * Step 4: Confirmation (registration submitted, awaiting verification)
 *
 * Data is sent to the server at the end of Step 3.
 */
export default function AccountantSignup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Step 2: Password Setup
    password: '',
    confirmPassword: '',

    // Step 3: Tax Practitioner Details
    businessName: '',
    registrationNumber: '',
    businessAddress: '',
    city: '',
    state: '',
    postcode: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const steps = [
    'Personal Details',
    'Password Setup',
    'Tax Practitioner Registration',
    'Confirmation'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear server error when user makes changes
    if (serverError) {
      setServerError('');
    }
  };

  /**
   * Extract error message from server response
   * Handles both embedded errors and direct message formats
   */
  const extractErrorMessage = (errorData) => {
    try {
      // Check for embedded errors format
      if (errorData._embedded && errorData._embedded.errors && errorData._embedded.errors.length > 0) {
        const firstError = errorData._embedded.errors[0].message;
        // Extract message after second colon if it exists
        const parts = firstError.split(':');
        if (parts.length >= 2) {
          return parts.slice(1).join(':').trim();
        }
        return firstError;
      }

      // Check for direct message
      if (errorData.message && errorData.message !== 'Bad Request') {
        return errorData.message;
      }

      // Check for error field
      if (errorData.error) {
        return errorData.error;
      }

      return 'An error occurred during registration. Please check your information and try again.';
    } catch (e) {
      return 'An unexpected error occurred. Please try again.';
    }
  };

  const validateStep = async (step) => {
    const newErrors = {};
    // Clear server error when validating
    setServerError('');

    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 1) {
      // Password validation - must match backend regex pattern exactly
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (formData.password.length > 100) {
        newErrors.password = 'Password must not exceed 100 characters';
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business/Trading name is required';
      }
      if (!formData.registrationNumber.trim()) {
        newErrors.registrationNumber = 'Registration number is required';
      } else if (!/^\d{8}$/.test(formData.registrationNumber)) {
        newErrors.registrationNumber = 'Registration number must be 8 digits';
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required';
      }
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.postcode.trim()) {
        newErrors.postcode = 'Postcode is required';
      } else if (!/^\d{4}$/.test(formData.postcode)) {
        newErrors.postcode = 'Postcode must be 4 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // If on Step 2 (Tax Practitioner Registration), submit to backend
    if (currentStep === 2) {
      await handleSubmit();
    } else {
      // Move to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0 && currentStep < 3) { // Can't go back from confirmation
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setServerError(''); // Clear any previous server errors

    try {
      const result = await registerAccountant(formData);

      if (result.success) {
        setRegistrationSuccess(true);
        // Move to confirmation step
        setCurrentStep(3);
      } else {
        // Parse and display server error
        const errorMessage = result.error || result.message || 'Registration failed. Please try again.';
        setServerError(errorMessage);

        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred during registration. Please try again.';
      setServerError(errorMessage);

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accountant Registration</h1>
            <p className="text-gray-600">Join our platform as a registered tax practitioner</p>
          </div>

          {/* Information Alert */}
          {currentStep < 3 && (
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Important Information</p>
                  <p>This signup process is specifically for registered accountants and tax practitioners. You will need to provide your tax practitioner registration details to complete the application. Your account will be reviewed before activation.</p>
                </div>
              </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                          index < currentStep
                              ? 'bg-green-500 text-white'
                              : index === currentStep
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index < currentStep ? <CheckCircle className="w-6 h-6" /> : index + 1}
                      </div>
                      <span className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                          index === currentStep ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                    {step}
                  </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 ${
                            index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                    )}
                  </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Step 1: Personal Details */}
            {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your.email@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+61 400 000 000"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
            )}

            {/* Step 2: Password Setup */}
            {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Important Password Notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                    <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">⚠️ Important: Save Your Password</p>
                      <p className="mb-2">
                        Please write down your password and store it in a safe place. You will need this password to log in after your account is verified.
                      </p>
                      <p className="text-xs italic">
                        We recommend using a password manager or writing it down securely. You cannot recover this password without contacting support.
                      </p>
                    </div>
                  </div>

                  <PasswordSetup
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                      showCurrentPassword={false}
                      title="Create Your Password"
                      subtitle="Choose a strong password to secure your account"
                      showRequirements={true}
                      passwordFieldName="password"
                      confirmPasswordFieldName="confirmPassword"
                  />

                  {/* Additional Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-blue-800">
                      <strong>Security Tip:</strong> Your password is encrypted and cannot be recovered. Make sure to save it securely before proceeding.
                    </p>
                  </div>
                </div>
            )}

            {/* Step 3: Tax Practitioner Registration */}
            {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Tax Practitioner Registration Details
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business/Trading Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.businessName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your business or trading name"
                    />
                    {errors.businessName && (
                        <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Practitioner Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 12345678"
                        maxLength="8"
                    />
                    {errors.registrationNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.businessAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Street address"
                    />
                    {errors.businessAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="City"
                      />
                      {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        <option value="">Select</option>
                        <option value="NSW">NSW</option>
                        <option value="VIC">VIC</option>
                        <option value="QLD">QLD</option>
                        <option value="WA">WA</option>
                        <option value="SA">SA</option>
                        <option value="TAS">TAS</option>
                        <option value="ACT">ACT</option>
                        <option value="NT">NT</option>
                      </select>
                      {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postcode <span className="text-red-500">*</span>
                      </label>
                      <input
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.postcode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0000"
                          maxLength="4"
                      />
                      {errors.postcode && (
                          <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Your registration details will be verified against the Tax Practitioners Board register.
                    </p>
                  </div>

                  {/* Server Error Display */}
                  {serverError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800">
                          <p className="font-semibold mb-1">Registration Error</p>
                          <p>{serverError}</p>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 3 && registrationSuccess && (
                <div className="space-y-6 text-center py-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Registration Submitted Successfully!
                  </h2>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
                    <div className="flex items-start gap-3 mb-4">
                      <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-semibold mb-2">What happens next?</p>
                        <ul className="space-y-2 ml-4 list-disc">
                          <li>Your tax practitioner registration details will be verified against the Tax Practitioners Board register</li>
                          <li>Our team will review your application within 1-2 business days</li>
                          <li>You will receive an email notification once your account is verified and approved</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-2">Check your email</p>
                        <p className="mb-2">
                          We've sent a confirmation email to <strong>{formData.email}</strong>
                        </p>
                        <p className="text-xs">
                          Once approved, you'll receive login credentials and can access the system using the password you created during registration.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left mt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Remember Your Password</p>
                        <p>
                          Make sure you've saved your password securely. You will need it to log in after your account is verified.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <a
                        href="/public"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Return to Home
                    </a>
                  </div>

                  <div className="pt-4 text-sm text-gray-600">
                    <p>Need help? Contact our support team at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a></p>
                  </div>
                </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                      onClick={handleBack}
                      disabled={currentStep === 0 || isLoading}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                          currentStep === 0 || isLoading
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>

                  <button
                      onClick={handleNext}
                      disabled={isLoading}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                          isLoading
                              ? 'bg-blue-400 cursor-not-allowed'
                              : currentStep === 2
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {currentStep === 2 ? 'Submitting...' : 'Processing...'}
                        </>
                    ) : currentStep === 2 ? (
                        <>
                          Submit Application
                          <CheckCircle className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                          Next
                          <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                  </button>
                </div>
            )}
          </div>

          {/* Footer */}
          {currentStep < 3 && (
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Need help? Contact our support team at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a></p>
              </div>
          )}
        </div>
      </div>
  );
}