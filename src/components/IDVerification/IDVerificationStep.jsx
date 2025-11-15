import React, { useState, useEffect } from 'react';
import { Upload, Check, AlertCircle, Loader2, LogOut } from 'lucide-react';

/**
 * ID Verification Step Component
 *
 * This component handles the ID verification process for both Accountants and Clients.
 * It's a prerequisite step before accessing any dashboard or registration form.
 *
 * Features:
 * - Document upload (Photo ID, License, Passport)
 * - Verification status tracking
 * - Loading states
 * - Error handling
 * - Support for both user roles (Accountant and Client)
 */
const IDVerificationStep = ({ userData, onVerificationComplete, onLogout }) => {
    const [step, setStep] = useState(1); // 1: Initial, 2: Upload, 3: Processing, 4: Complete/Failed
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'pending', 'verified', 'failed'
    const [errorMessage, setErrorMessage] = useState('');

    const userRole = userData?.userRole || 'CLIENT';
    const displayName = userData?.email || 'User';

    /**
     * Handle document type selection
     */
    const handleDocumentSelect = (docType) => {
        setSelectedDocument(docType);
        setStep(2);
    };

    /**
     * Handle file upload
     */
    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Please upload a valid image (JPG, PNG) or PDF file');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setErrorMessage('File size must be less than 5MB');
            return;
        }

        setUploadedFile(file);
        setErrorMessage('');

        // Simulate upload and verification process
        await simulateUploadAndVerification(file);
    };

    /**
     * Simulate the upload and verification process
     * In a real application, this would:
     * 1. Upload the file to the backend
     * 2. The backend would perform ID verification (OCR, face detection, etc.)
     * 3. Return verification status
     */
    const simulateUploadAndVerification = async (file) => {
        setIsUploading(true);
        setStep(3);
        setVerificationStatus('pending');

        try {
            // In a real application, you would upload to your backend API
            // const formData = new FormData();
            // formData.append('document', file);
            // formData.append('documentType', selectedDocument);
            // formData.append('userId', userData.id);
            //
            // const response = await fetch(`${API_BASE_URL}/id-verification/upload`, {
            //     method: 'POST',
            //     body: formData
            // });
            //
            // if (!response.ok) {
            //     throw new Error('Verification failed');
            // }
            //
            // const result = await response.json();
            // setVerificationStatus(result.verified ? 'verified' : 'failed');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock verification success (90% of the time)
            // In production, this would be based on actual verification service
            const isVerified = Math.random() > 0.1;

            if (isVerified) {
                setVerificationStatus('verified');
                // Auto-proceed after 2 seconds
                setTimeout(() => {
                    setStep(4);
                    // Call completion handler
                    onVerificationComplete?.();
                }, 2000);
            } else {
                setVerificationStatus('failed');
                setErrorMessage('ID verification failed. Please ensure the document is clear and valid.');
                setStep(4);
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('failed');
            setErrorMessage('An error occurred during verification. Please try again.');
            setStep(4);
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Reset the verification process
     */
    const handleReset = () => {
        setStep(1);
        setSelectedDocument(null);
        setUploadedFile(null);
        setVerificationStatus(null);
        setErrorMessage('');
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

                {/* Step 1: Document Type Selection */}
                {step === 1 && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Verify Your Identity
                            </h2>
                            <p className="text-gray-600">
                                Please select the type of ID document you'd like to use for verification.
                            </p>
                        </div>

                        {/* Information Alert */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Why we need this</p>
                                    <p>
                                        ID verification is required to comply with Australian regulations and ensure the security of your account.
                                        All documents are securely processed and stored.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Document Type Options */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    type: 'DRIVERS_LICENSE',
                                    name: 'Driver\'s License',
                                    description: 'Australian Driver\'s License'
                                },
                                {
                                    type: 'PASSPORT',
                                    name: 'Passport',
                                    description: 'Australian Passport'
                                },
                                {
                                    type: 'PHOTO_ID',
                                    name: 'Photo ID',
                                    description: 'Other official photo ID'
                                }
                            ].map((doc) => (
                                <button
                                    key={doc.type}
                                    onClick={() => handleDocumentSelect(doc.type)}
                                    className="p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {doc.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {doc.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Document Upload */}
                {step === 2 && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Upload Your {selectedDocument?.replace('_', ' ')}
                            </h2>
                            <p className="text-gray-600">
                                Please upload a clear image or PDF of your document.
                            </p>
                        </div>

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-indigo-500 transition-colors">
                            <input
                                type="file"
                                id="document-upload"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                            <label
                                htmlFor="document-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                <span className="text-lg font-medium text-gray-700 mb-1">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-sm text-gray-500">
                                    JPG, PNG or PDF (max. 5MB)
                                </span>
                            </label>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800 text-sm">{errorMessage}</p>
                            </div>
                        )}

                        {/* File Info */}
                        {uploadedFile && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <p className="text-green-800 text-sm">
                                    <strong>Selected file:</strong> {uploadedFile.name}
                                </p>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-medium text-gray-700 mb-2">Tips for best results:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Ensure the entire document is visible and in focus</li>
                                <li>• Use good lighting to avoid shadows or glare</li>
                                <li>• Document should be unfolded and flat</li>
                                <li>• All four corners should be visible</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                disabled={isUploading}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    if (!uploadedFile) {
                                        setErrorMessage('Please select a file first');
                                        return;
                                    }
                                    // File upload is triggered on file selection
                                }}
                                disabled={isUploading || !uploadedFile}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
                            >
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Processing */}
                {step === 3 && verificationStatus === 'pending' && (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <Loader2 className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Verifying Your ID
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we verify your document. This usually takes 1-2 minutes.
                        </p>
                    </div>
                )}

                {/* Step 4: Results */}
                {step === 4 && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {verificationStatus === 'verified' && (
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Verification Complete
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Your ID has been successfully verified. You can now access your account.
                                </p>
                                <button
                                    onClick={() => {
                                        // The route will automatically redirect based on role
                                        window.location.href = '/';
                                    }}
                                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Continue to Dashboard
                                </button>
                            </div>
                        )}

                        {verificationStatus === 'failed' && (
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Verification Failed
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {errorMessage || 'We couldn\'t verify your ID. Please try again with a clearer image or different document.'}
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IDVerificationStep;