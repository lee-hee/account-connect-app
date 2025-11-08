import React, { useState } from 'react';

/**
 * Reusable Password Setup Component
 * 
 * @param {Object} props
 * @param {Object} props.formData - Form data object containing password fields
 * @param {Object} props.errors - Validation errors object
 * @param {Function} props.onChange - Handler for input changes
 * @param {boolean} props.showCurrentPassword - Whether to show current password field (default: false)
 * @param {string} props.title - Custom title (default: "Password Setup")
 * @param {string} props.subtitle - Custom subtitle
 * @param {boolean} props.showRequirements - Whether to show password requirements (default: true)
 * @param {string} props.passwordFieldName - Name of password field (default: "password")
 * @param {string} props.confirmPasswordFieldName - Name of confirm password field (default: "confirmPassword")
 * @param {string} props.currentPasswordFieldName - Name of current password field (default: "currentPassword")
 */
const PasswordSetup = ({
  formData,
  errors,
  onChange,
  showCurrentPassword = false,
  title = "Password Setup",
  subtitle = "Create a strong password to secure your account",
  showRequirements = true,
  passwordFieldName = "password",
  confirmPasswordFieldName = "confirmPassword",
  currentPasswordFieldName = "currentPassword"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPasswordField, setShowCurrentPasswordField] = useState(false);

  const password = formData[passwordFieldName] || '';
  const confirmPassword = formData[confirmPasswordFieldName] || '';
  const currentPassword = formData[currentPasswordFieldName] || '';

  // Password validation checks
  const validations = {
    length: password.length >= 8,
    lowercase: /(?=.*[a-z])/.test(password),
    uppercase: /(?=.*[A-Z])/.test(password),
    number: /(?=.*\d)/.test(password),
    special: /(?=.*[@$!%*?&])/.test(password)
  };

  const EyeIcon = ({ show }) => (
    show ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    )
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
      
      {/* Current Password Field (Optional) */}
      {showCurrentPassword && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPasswordField ? "text" : "password"}
              name={currentPasswordFieldName}
              value={currentPassword}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors[currentPasswordFieldName] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPasswordField(!showCurrentPasswordField)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <EyeIcon show={showCurrentPasswordField} />
            </button>
          </div>
          {errors[currentPasswordFieldName] && (
            <p className="mt-1 text-sm text-red-600">{errors[currentPasswordFieldName]}</p>
          )}
        </div>
      )}

      {/* New Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {showCurrentPassword ? 'New Password' : 'Password'} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name={passwordFieldName}
            value={password}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[passwordFieldName] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={showCurrentPassword ? "Enter your new password" : "Enter your password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <EyeIcon show={showPassword} />
          </button>
        </div>
        {errors[passwordFieldName] && (
          <p className="mt-1 text-sm text-red-600">{errors[passwordFieldName]}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {showCurrentPassword ? 'Confirm New Password' : 'Confirm Password'} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name={confirmPasswordFieldName}
            value={confirmPassword}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[confirmPasswordFieldName] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <EyeIcon show={showConfirmPassword} />
          </button>
        </div>
        {errors[confirmPasswordFieldName] && (
          <p className="mt-1 text-sm text-red-600">{errors[confirmPasswordFieldName]}</p>
        )}
      </div>

      {/* Password Requirements */}
      {showRequirements && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className={`flex items-center ${validations.length ? 'text-green-600' : ''}`}>
              <span className="mr-2">{validations.length ? '✓' : '○'}</span>
              At least 8 characters long
            </li>
            <li className={`flex items-center ${validations.lowercase ? 'text-green-600' : ''}`}>
              <span className="mr-2">{validations.lowercase ? '✓' : '○'}</span>
              One lowercase letter
            </li>
            <li className={`flex items-center ${validations.uppercase ? 'text-green-600' : ''}`}>
              <span className="mr-2">{validations.uppercase ? '✓' : '○'}</span>
              One uppercase letter
            </li>
            <li className={`flex items-center ${validations.number ? 'text-green-600' : ''}`}>
              <span className="mr-2">{validations.number ? '✓' : '○'}</span>
              One number
            </li>
            <li className={`flex items-center ${validations.special ? 'text-green-600' : ''}`}>
              <span className="mr-2">{validations.special ? '✓' : '○'}</span>
              One special character (@$!%*?&)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordSetup;
