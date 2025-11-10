import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

const AgreementsStep = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Terms & Agreements</h2>
      <p className="text-sm text-gray-600 mb-6">Please review and accept the following agreements to continue</p>

      {/* Terms of Service Agreement */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex items-start mb-4">
          <FileText className="mr-3 text-indigo-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Terms of Service Agreement</h3>
            <p className="text-sm text-gray-600 mb-4">Effective Date: November 2025</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
          <div className="text-sm text-gray-700 space-y-3">
            <p className="font-semibold">1. Acceptance of Terms</p>
            <p>
              By accessing and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
              These terms constitute a legally binding agreement between you and our organization.
            </p>

            <p className="font-semibold">2. Service Description</p>
            <p>
              We provide accounting and tax preparation services for individuals and business entities. Our services include but are not limited to 
              tax return preparation, financial consulting, bookkeeping, and business advisory services.
            </p>

            <p className="font-semibold">3. Client Responsibilities</p>
            <p>
              You agree to provide accurate, complete, and timely information required for service delivery. You are responsible for maintaining 
              the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <p className="font-semibold">4. Confidentiality</p>
            <p>
              We maintain strict confidentiality of all client information in accordance with professional accounting standards and applicable 
              privacy laws. Your personal and financial information will not be shared with third parties without your explicit consent, except 
              as required by law.
            </p>

            <p className="font-semibold">5. Fees and Payment</p>
            <p>
              Service fees will be communicated prior to engagement. Payment terms are net 30 days unless otherwise specified. Late payments 
              may incur additional charges as permitted by law.
            </p>

            <p className="font-semibold">6. Limitation of Liability</p>
            <p>
              While we strive for accuracy in all our services, we shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from the use of our services. Our liability is limited to the fees paid for the specific service in question.
            </p>

            <p className="font-semibold">7. Termination</p>
            <p>
              Either party may terminate this agreement with written notice. Upon termination, you remain responsible for any outstanding fees 
              for services rendered.
            </p>

            <p className="font-semibold">8. Governing Law</p>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Australia, without regard to conflict of law principles.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms || false}
            onChange={handleInputChange}
            className={`w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1 flex-shrink-0 ${
              errors.agreeToTerms ? 'border-red-500' : ''
            }`}
          />
          <label className="ml-3 text-sm text-gray-700">
            <span className="font-medium">I have read and agree to the Terms of Service <span className="text-red-500">*</span></span>
            <p className="text-xs text-gray-500 mt-1">
              By checking this box, you acknowledge that you have read, understood, and agree to be bound by the Terms of Service.
            </p>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs mt-2 ml-8">{errors.agreeToTerms}</p>
        )}
      </div>

      {/* Privacy Policy Agreement */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex items-start mb-4">
          <FileText className="mr-3 text-indigo-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy Policy Agreement</h3>
            <p className="text-sm text-gray-600 mb-4">Effective Date: November 2025</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
          <div className="text-sm text-gray-700 space-y-3">
            <p className="font-semibold">1. Information We Collect</p>
            <p>
              We collect personal information including but not limited to your name, contact details, date of birth, tax file number, 
              financial information, banking details, and business entity information necessary to provide our accounting and tax services.
            </p>

            <p className="font-semibold">2. How We Use Your Information</p>
            <p>
              Your information is used solely for the purpose of providing accounting, tax preparation, and related professional services. 
              This includes preparing tax returns, maintaining financial records, communicating with tax authorities on your behalf, and 
              providing financial advice and consulting services.
            </p>

            <p className="font-semibold">3. Data Security</p>
            <p>
              We implement industry-standard security measures to protect your personal and financial information. This includes encryption, 
              secure data storage, access controls, and regular security audits. All staff members are bound by confidentiality agreements.
            </p>

            <p className="font-semibold">4. Information Sharing</p>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Government agencies (ATO, ASIC) as required by law</li>
              <li>Professional service providers working on your behalf</li>
              <li>Legal or regulatory authorities when required</li>
            </ul>

            <p className="font-semibold">5. Data Retention</p>
            <p>
              We retain your information for the period required by law, typically 7 years for tax and financial records. After this period, 
              information is securely destroyed unless you request otherwise or legal obligations require continued retention.
            </p>

            <p className="font-semibold">6. Your Rights</p>
            <p>
              You have the right to access, correct, or request deletion of your personal information. You may request a copy of the information 
              we hold about you at any time. You may also opt out of marketing communications while still receiving service-related notifications.
            </p>

            <p className="font-semibold">7. Cookies and Tracking</p>
            <p>
              Our website uses cookies to improve user experience and analyze usage patterns. You can control cookie preferences through your 
              browser settings. Essential cookies required for service functionality cannot be disabled.
            </p>

            <p className="font-semibold">8. Changes to Privacy Policy</p>
            <p>
              We may update this privacy policy periodically. Changes will be communicated via email and posted on our website. Continued use 
              of our services after changes constitutes acceptance of the updated policy.
            </p>

            <p className="font-semibold">9. Contact Information</p>
            <p>
              For any privacy-related questions or concerns, please contact our Privacy Officer at privacy@accountconnect.com.au or 
              call 1300 XXX XXX.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            name="agreeToPrivacy"
            checked={formData.agreeToPrivacy || false}
            onChange={handleInputChange}
            className={`w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1 flex-shrink-0 ${
              errors.agreeToPrivacy ? 'border-red-500' : ''
            }`}
          />
          <label className="ml-3 text-sm text-gray-700">
            <span className="font-medium">I have read and agree to the Privacy Policy <span className="text-red-500">*</span></span>
            <p className="text-xs text-gray-500 mt-1">
              By checking this box, you acknowledge that you have read, understood, and agree to our Privacy Policy and consent to the 
              collection, use, and storage of your personal information as described.
            </p>
          </label>
        </div>
        {errors.agreeToPrivacy && (
          <p className="text-red-500 text-xs mt-2 ml-8">{errors.agreeToPrivacy}</p>
        )}
      </div>

      {/* Summary Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
        <CheckCircle className="text-green-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-green-800">
          <p className="font-medium mb-1">Almost Done!</p>
          <p>
            Please review both agreements carefully and check the boxes to confirm your acceptance. 
            Both agreements must be accepted to complete your registration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgreementsStep;
