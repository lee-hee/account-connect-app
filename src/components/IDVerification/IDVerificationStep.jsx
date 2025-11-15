import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { createVerificationSession } from '../../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * ID Verification Step Component with Stripe Identity Integration
 *
 * This component handles the ID verification process for both Accountants and Clients
 * using Stripe Identity's redirect-based verification flow.
 *
 * Features:
 * - Stripe Identity verification
 * - Support for both user roles (Accountant and Client)
 * - Redirects to VerificationComplete page after submission
 * - Uses centralized API methods from api.js
 */
const IDVerificationStep = ({ userData, onLogout }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const userRole = userData?.userRole || 'CLIENT';
    const displayName = userData?.email || 'User';

    /**
     * Start verification process
     * Creates session and redirects to Stripe Identity
     */
    const handleStartVerification = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            // Store email in localStorage for the return page
            localStorage.setItem('userEmail', userData.email);

            // Call the API method from api.js
            const response = await createVerificationSession(
                userData.userId,
                userData.email,
                userData.userRole
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to create verification session');
            }

            const clientSecret = response.clientSecret;
            const sessionId = response.verificationSessionId;

            // Store session ID for potential status checks
            localStorage.setItem('verificationSessionId', sessionId);

            // Check if Stripe is loaded
            if (!window.Stripe) {
                throw new Error('Stripe.js not loaded. Please refresh the page.');
            }

            // Initialize Stripe
            const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SJQSyRptfmwcvKRus8IxgUjzmZP6WbOVj6MH9RH0pED5HrsKxOvQwGPqarwUvjI2SHu50fipk6DI7VPPOpTFISY00aenlCMtQ');

            // Redirect to Stripe Identity verification
            const { error } = await stripe.verifyIdentity(clientSecret);

            if (error) {
                throw new Error(error.message);
            }

            // User completed verification - redirect to VerificationComplete page
            navigate('/verification/complete');

        } catch (error) {
            console.error('❌ Error starting verification:', error);
            setErrorMessage(error.message || 'Failed to initialize verification. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Return to login
     */
    const handleReturnToLogin = () => {
        onLogout();
    };

    /**
     * Load Stripe.js script only once
     */
    useEffect(() => {
        // Check if Stripe script is already loaded
        if (window.Stripe) {
            console.log('✅ Stripe.js already loaded');
            return;
        }

        // Load Stripe script
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
            console.log('✅ Stripe.js loaded successfully');
        };
        script.onerror = () => {
            console.error('❌ Failed to load Stripe.js');
            setErrorMessage('Failed to load verification system. Please refresh the page.');
        };

        document.body.appendChild(script);

        // Cleanup is intentionally not done to keep Stripe.js loaded
        // This prevents the "loaded more than once" error
    }, []); // Empty dependency array - only run once

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">ID Verification</h1>
                        <p className="text-gray-600 mt-2">
                            {userRole === 'ACCOUNTANT' ? 'Tax Agent' : 'Client'} • {displayName}
                        </p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                    >
                        <LogOut size={16} className="mr-2" />
                        Logout
                    </button>
                </div>

                {/* Verification Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Verify Your Identity
                        </h2>
                        <p className="text-gray-600">
                            To comply with Australian regulations and ensure the security of your account,
                            we need to verify your identity using a government-issued ID.
                        </p>
                    </div>

                    {/* Information Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">What you'll need</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>A government-issued photo ID (Driver's License or Passport)</li>
                                    <li>A device with a camera (phone or webcam)</li>
                                    <li>Good lighting and a clear background</li>
                                    <li>About 5 minutes to complete the process</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-green-800">
                                <p className="font-medium mb-1">Your information is secure</p>
                                <p>
                                    We use Stripe Identity, a trusted verification service that securely
                                    processes and encrypts your identity documents. Your data is protected
                                    and will only be used for verification purposes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {/* Start Button */}
                    <button
                        onClick={handleStartVerification}
                        disabled={isLoading}
                        className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                            isLoading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white flex items-center justify-center`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Initializing Verification...
                            </>
                        ) : (
                            <>
                                <Shield className="mr-2" size={20} />
                                Start Verification
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        By continuing, you agree to Stripe's{' '}
                        <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IDVerificationStep;