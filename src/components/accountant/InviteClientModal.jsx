import React, { useState } from 'react';
import { X, UserPlus, Loader2, CheckCircle, Mail } from 'lucide-react';
import { provisionClient } from '../../services/api';

/**
 * Invite Client Modal Component (Improved Version)
 * Allows accountants to provision new clients by providing minimal information
 * Uses the API service function for better code organization
 */
const InviteClientModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (!isOpen) {
            // Reset after a delay to allow closing animation
            setTimeout(() => {
                setFormData({ firstName: '', lastName: '', email: '' });
                setErrors({});
                setSubmitSuccess(false);
            }, 300);
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 1 || formData.firstName.trim().length > 100) {
            newErrors.firstName = 'First name must be between 1 and 100 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 1 || formData.lastName.trim().length > 100) {
            newErrors.lastName = 'Last name must be between 1 and 100 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        } else if (formData.email.trim().length > 255) {
            newErrors.email = 'Email must not exceed 255 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the provision client API using the service function
            const result = await provisionClient(formData);

            if (!result.success) {
                throw new Error(result.error || 'Failed to provision client');
            }

            // Success! Show success message
            setSubmitSuccess(true);

            // Call success callback after a delay
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(result.data);
                }
            }, 2000);

        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="flex items-center">
                        <UserPlus className="text-indigo-600 mr-3" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Invite New Client
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!submitSuccess ? (
                        <>
                            {/* Info Message */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start">
                                    <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Automatic Password Generation</p>
                                        <p>
                                            A secure random password will be automatically generated and sent to the 
                                            client's email address. The client can change this password after their first login.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter first name"
                                        disabled={isSubmitting}
                                        maxLength={100}
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter last name"
                                        disabled={isSubmitting}
                                        maxLength={100}
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.lastName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="client@example.com"
                                        disabled={isSubmitting}
                                        maxLength={255}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Make sure this email address is correct. Login credentials will be sent here.
                                    </p>
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                                        <p className="text-sm text-red-800">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={16} />
                                                Inviting...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2" size={16} />
                                                Invite Client
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        // Success State
                        <div className="text-center py-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Client Invited Successfully!
                            </h3>
                            
                            <p className="text-gray-600 mb-4">
                                {formData.firstName} {formData.lastName} has been provisioned as a new client.
                            </p>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <Mail className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div className="text-left text-sm text-green-800">
                                        <p className="font-medium mb-1">Email Notification Sent</p>
                                        <p>
                                            A secure password has been generated and sent to <strong>{formData.email}</strong>. 
                                            The client can use this password to log in and complete their registration.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Next Steps:</strong> The client will receive an email with their login credentials 
                                    and instructions to complete their profile setup.
                                </p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteClientModal;
