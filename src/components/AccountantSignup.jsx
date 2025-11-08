import React, { useState } from 'react';
import { AlertCircle, CheckCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { 
  registerAccountant, 
  checkAccountantEmailExists
} from '../services/api';

/**
 * Accountant Registration Component
 * 
 * This is a 3-step registration form that collects all data on the frontend
 * and sends it as a single "fat DTO" to the backend only at the final step.
 * 
 * Step 1: Personal Details (firstName, lastName, email, phone)
 * Step 2: Password Setup (password, confirmPassword)
 * Step 3: Tax Practitioner Registration (businessName, registrationNumber, address)
 * 
 * NO data is sent to the server until the user clicks "Submit Application" 
 * on the final step. All validation happens client-side during navigation.
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    'Personal Details',
    'Password Setup',
    'Tax Practitioner Registration'
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
  };

  const validateStep = async (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        // Check if email already exists
        const emailCheck = await checkAccountantEmailExists(formData.email);
        if (emailCheck.success && emailCheck.exists) {
          newErrors.email = 'This email is already registered';
        }
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 1) {
      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character (@$!%*?&)';
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

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    setIsLoading(true);

    try {
      const result = await registerAccountant(formData);

      if (result.success) {
        alert(result.message || 'Registration submitted successfully! You will receive an email once your application has been reviewed.');
        // You could redirect to a confirmation page here
        // window.location.href = '/accountant/registration-success';
      } else {
        alert(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred during registration. Please try again.');
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
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Important Information</p>
            <p>This signup process is specifically for registered accountants and tax practitioners. You will need to provide your tax practitioner registration details to complete the application. Your account will be reviewed before activation.</p>
          </div>
        </div>

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
                  <span className={`mt-2 text-xs sm:text-sm font-medium ${
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Password Setup</h2>
              <p className="text-sm text-gray-600 mb-6">
                Create a strong password to secure your account
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
                    At least 8 characters long
                  </li>
                  <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}</span>
                    One lowercase letter
                  </li>
                  <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
                    One uppercase letter
                  </li>
                  <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/(?=.*\d)/.test(formData.password) ? '✓' : '○'}</span>
                    One number
                  </li>
                  <li className={`flex items-center ${/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-2">{/(?=.*[@$!%*?&])/.test(formData.password) ? '✓' : '○'}</span>
                    One special character (@$!%*?&)
                  </li>
                </ul>
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
            </div>
          )}

          {/* Navigation Buttons */}
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

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white flex items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need help? Contact our support team at support@example.com</p>
        </div>
      </div>
    </div>
  );
}
