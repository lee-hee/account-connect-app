import React, { useState, useEffect, useRef } from 'react';
import { Shield, AlertCircle, Loader2, LogOut, CheckCircle, Mail } from 'lucide-react';
import { createVerificationSession } from '../../services/api';

/**
 * ID Verification Step Component with Stripe Identity Integration
 *
 * This component handles the ID verification process for both Accountants and Clients
 * using Stripe Identity's embedded verification flow.
 *
 * Features:
 * - Stripe Identity embedded verification
 * - Support for both user roles (Accountant and Client)
 * - Email confirmation flow
 * - Uses centralized API methods from api.js
 */
const IDVerificationStep = ({ userData, onVerificationComplete, onLogout }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStarted, setVerificationStarted] = useState(false);
    const [verificationSubmitted, setVerificationSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [clientSecret, setClientSecret] = useState(null);

    const verificationElementRef = useRef(null);
    const stripeIdentityRef = useRef(null);

    const userRole = userData?.userRole || 'CLIENT';
    const displayName = userData?.email || 'User';

    /**
     * Load Stripe Identity script
     */
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
            console.log('✅ Stripe.js loaded successfully');
        };
        document.body.appendChild(script);

        return () => {
            // Clean up script on unmount
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    /**
     * Initialize Stripe Identity verification
     */
    const initializeStripeVerification = async (secret) => {
        try {
            if (!window.Stripe) {
                throw new Error('Stripe.js not loaded');
            }

            // TODO: Replace with your actual Stripe publishable key
            // Get this from your Stripe dashboard
            const stripe = window.Stripe('pk_test_51SJQSyRptfmwcvKRus8IxgUjzmZP6WbOVj6MH9RH0pED5HrsKxOvQwGPqarwUvjI2SHu50fipk6DI7VPPOpTFISY00aenlCMtQ');

            // Create the verification element
            const verificationElement = stripe.verifyIdentity(secret);

            // Mount the element to the DOM
            verificationElement.mount(verificationElementRef.current);

            stripeIdentityRef.current = verificationElement;

            // Listen for verification events
            verificationElement.on('submit', () => {
                console.log('✅ Verification submitted by user');
                handleVerificationSubmit();
            });

            verificationElement.on('error', (error) => {
                console.error('❌ Verification error:', error);
                setErrorMessage('An error occurred during verification. Please try again.');
            });

        } catch (error) {
            console.error('❌ Error initializing Stripe verification:', error);
            setErrorMessage('Failed to load verification interface. Please refresh the page.');
        }
    };

    /**
     * Start verification process
     * Now uses centralized API method from api.js
     */
    const handleStartVerification = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            // Call the API method from api.js
            const response = await createVerificationSession(
                userData.userId,
                userData.email,
                userData.userRole
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to create verification session');
            }

            const secret = response.clientSecret;
            setClientSecret(secret);
            setVerificationStarted(true);

            // Wait for next render to mount the element
            setTimeout(() => {
                initializeStripeVerification(secret);
            }, 100);

        } catch (error) {
            console.error('❌ Error starting verification:', error);
            setErrorMessage(error.message || 'Failed to initialize verification. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle verification submission
     */
    const handleVerificationSubmit = () => {
        setVerificationSubmitted(true);

        // Unmount the verification element
        if (stripeIdentityRef.current) {
            stripeIdentityRef.current.unmount();
        }
    };

    /**
     * Return to login
     */
    const handleReturnToLogin = () => {
        onLogout();
    };

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

                {/* Initial State - Before verification starts */}
                {!verificationStarted && !verificationSubmitted && (
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
                                    Initializing...
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
                )}

                {/* Verification In Progress */}
                {verificationStarted && !verificationSubmitted && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Identity Verification
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Please follow the instructions below to complete your identity verification.
                            </p>
                        </div>

                        {/* Stripe Identity Element Container */}
                        <div
                            ref={verificationElementRef}
                            className="min-h-[500px]"
                        ></div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                                <p className="text-red-800 text-sm">{errorMessage}</p>
                            </div>
                        )}

                        {/* Help Text */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Having trouble?</strong> Make sure you have good lighting and that your
                                entire ID is visible in the frame. If you continue to experience issues, please
                                contact our support team.
                            </p>
                        </div>
                    </div>
                )}

                {/* Verification Submitted - Confirmation */}
                {verificationSubmitted && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Verification Submitted
                            </h2>

                            <p className="text-gray-600 mb-6">
                                Thank you for completing the identity verification process.
                            </p>

                            {/* Email Confirmation Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-2">What happens next?</p>
                                        <ul className="space-y-2 ml-4 list-disc">
                                            <li>
                                                Your identity verification is being processed by our secure verification partner
                                            </li>
                                            <li>
                                                You will receive an email at <strong>{displayName}</strong> within 24 hours
                                                with the verification outcome
                                            </li>
                                            <li>
                                                If your verification is successful, you'll be able to log in and access your account
                                            </li>
                                            <li>
                                                If additional information is needed, we'll send you instructions via email
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-800">
                                        <p className="font-medium mb-1">Please note</p>
                                        <p>
                                            Your account will remain pending until the verification process is complete.
                                            Please check your email regularly for updates.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Return to Login Button */}
                            <button
                                onClick={handleReturnToLogin}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Return to Login
                            </button>

                            <p className="text-xs text-gray-500 mt-4">
                                Need help? Contact our support team at{' '}
                                <a href="mailto:support@accountconnect.com.au" className="text-indigo-600 hover:underline">
                                    support@accountconnect.com.au
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IDVerificationStep;