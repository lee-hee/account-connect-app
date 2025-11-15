import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Verification Complete Component
 * 
 * This component is displayed when users return from Stripe Identity verification.
 * It shows a confirmation message and explains the next steps.
 * 
 * URL: /verification/complete
 */
const VerificationComplete = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Get email from URL params or localStorage
    const userEmail = searchParams.get('email') || localStorage.getItem('userEmail') || 'your email';

    useEffect(() => {
        // Simulate a brief loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleReturnToLogin = () => {
        // Clear any stored session data
        localStorage.removeItem('userEmail');
        localStorage.removeItem('verificationSessionId');
        
        // Navigate to login page
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Processing your verification...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Verification Submitted Successfully
                    </h1>
                    <p className="text-gray-600">
                        Thank you for completing the identity verification process
                    </p>
                </div>

                {/* Main Information Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    {/* What Happens Next Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            What happens next?
                        </h2>
                        
                        <div className="space-y-4">
                            {/* Step 1 */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                                    1
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        <strong>Verification Processing</strong>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Your identity documents are being securely verified by our verification partner, Stripe Identity.
                                        This process typically takes a few minutes to 24 hours.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                                    2
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        <strong>Email Notification</strong>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        You will receive an email at <strong>{userEmail}</strong> with the verification outcome.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 - Success */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        <strong>If Verification is Successful</strong>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        You'll receive an email confirmation and be able to log in to your account immediately.
                                        Your account will be fully activated and ready to use.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 - Additional Info Needed */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-semibold">
                                    !
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        <strong>If Additional Information is Needed</strong>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        We'll send you detailed instructions via email on what additional information or documents are required.
                                        You may be asked to resubmit your verification with clearer images or different documents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email Check Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-blue-900 mb-2">
                                    Check Your Email Inbox
                                </p>
                                <p className="text-sm text-blue-800 mb-3">
                                    We've sent a confirmation to <strong>{userEmail}</strong>
                                </p>
                                <div className="text-sm text-blue-800 space-y-1">
                                    <p>• Check your inbox and spam/junk folder</p>
                                    <p>• Add support@accountconnect.com.au to your contacts</p>
                                    <p>• Email notifications are usually sent within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-amber-900 mb-2">
                                    Account Status: Pending Verification
                                </p>
                                <p className="text-sm text-amber-800">
                                    Your account will remain in pending status until the identity verification process is complete.
                                    You will not be able to access your account until verification is successful.
                                    Please check your email regularly for updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleReturnToLogin}
                        className="w-full px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        Return to Login
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Support Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Need help or have questions?
                        </p>
                        <a 
                            href="mailto:support@accountconnect.com.au" 
                            className="text-indigo-600 hover:underline font-medium text-sm"
                        >
                            Contact Support Team
                        </a>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-medium text-gray-700">How long does verification take?</p>
                            <p className="text-gray-600 mt-1">
                                Most verifications are processed within a few minutes to a few hours. 
                                In some cases, it may take up to 24 hours.
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">What if my verification fails?</p>
                            <p className="text-gray-600 mt-1">
                                You will receive an email with specific reasons and instructions on how to resubmit 
                                your verification with the correct information or documents.
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Is my information secure?</p>
                            <p className="text-gray-600 mt-1">
                                Yes. We use Stripe Identity, a trusted and secure verification service that encrypts 
                                and protects all your personal information and documents.
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Can I start using my account now?</p>
                            <p className="text-gray-600 mt-1">
                                No, you must wait for the verification to be approved before you can log in and 
                                access your account. You will receive an email once your account is activated.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationComplete;
