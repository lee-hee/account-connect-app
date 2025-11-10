import React from 'react';
import { User, DollarSign, Home, Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

const PreviewStep = ({ formData }) => {
  const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex items-center mb-4 pb-3 border-b border-gray-200">
        <Icon className="text-indigo-600 mr-3" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, fullWidth = false }) => (
    <div className={`${fullWidth ? 'col-span-2' : ''} mb-3`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-800">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    </div>
  );

  const EntityCard = ({ title, index, children }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title} {index !== undefined && `#${index + 1}`}</h4>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Review Your Information</h2>
        <p className="text-sm text-gray-600">Please review all the information below before submitting</p>
      </div>

      {/* Personal Information */}
      <InfoSection title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="First Name" value={formData.firstName} />
          <InfoRow label="Last Name" value={formData.lastName} />
          <InfoRow label="Middle Name" value={formData.middleName} />
          <InfoRow label="Date of Birth" value={formData.dob} />
          <InfoRow label="Tax File Number" value={formData.tfn} />
          <InfoRow label="Email" value={formData.email} />
          <InfoRow label="Contact Number" value={formData.contactNo} />
        </div>
      </InfoSection>

      {/* Financial Details */}
      <InfoSection title="Financial Details" icon={DollarSign}>
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Primary Bank Account</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Bank Name" value={formData.bankName} />
            <InfoRow label="Account Name" value={formData.accountName} />
            <InfoRow label="BSB" value={formData.bsb} />
            <InfoRow label="Account Number" value={formData.accountNumber} />
          </div>
        </div>

        {(formData.hasCrypto || formData.hasInvestmentProperty || formData.hasStocks) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Income Streams</h4>
            <div className="flex flex-wrap gap-2">
              {formData.hasCrypto && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  Cryptocurrency {formData.cryptoType && `(${formData.cryptoType})`}
                </span>
              )}
              {formData.hasInvestmentProperty && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Investment Property
                </span>
              )}
              {formData.hasStocks && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Stocks
                </span>
              )}
            </div>
          </div>
        )}
      </InfoSection>

      {/* Address & Residency */}
      <InfoSection title="Address & Residency" icon={Home}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Residential Address" value={formData.addressResidential} fullWidth />
          <InfoRow label="Postal Address" value={formData.addressPostal} fullWidth />
          <InfoRow label="Residency Status" value={formData.residencyStatus} />
        </div>
      </InfoSection>

      {/* Family Details */}
      <InfoSection title="Family Details" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Number of Dependent Children" value={formData.noOfDependentChildren} />
          <InfoRow label="Spouse Name" value={formData.spouseName} />
          <InfoRow label="Spouse Date of Birth" value={formData.spouseDob} />
        </div>
      </InfoSection>

      {/* Business Entities */}
      {(formData.soleTrader || formData.companies?.length > 0 || formData.trusts?.length > 0 || 
        formData.smsfs?.length > 0 || formData.partnerships?.length > 0) && (
        <InfoSection title="Business Entities & Investments" icon={Briefcase}>
          {/* Sole Trader */}
          {formData.soleTrader && (
            <EntityCard title="Sole Trader">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <InfoRow label="ABN" value={formData.soleTrader.abn} />
                <InfoRow label="GST Registered" value={formData.soleTrader.gstRegistered ? 'Yes' : 'No'} />
                <InfoRow label="Trading Names" value={formData.soleTrader.tradingNames?.filter(n => n).join(', ')} fullWidth />
                <InfoRow label="Business Address" value={formData.soleTrader.businessAddress} fullWidth />
                <InfoRow label="Registered Address" value={formData.soleTrader.registeredAddress} fullWidth />
                {!formData.soleTrader.usePrimaryBanking && (
                  <>
                    <InfoRow label="Bank Name" value={formData.soleTrader.bankName} />
                    <InfoRow label="Account Name" value={formData.soleTrader.accountName} />
                    <InfoRow label="BSB" value={formData.soleTrader.bsb} />
                    <InfoRow label="Account Number" value={formData.soleTrader.accountNumber} />
                  </>
                )}
                {formData.soleTrader.usePrimaryBanking && (
                  <div className="col-span-2">
                    <p className="text-xs text-indigo-600">Using primary banking details</p>
                  </div>
                )}
              </div>
            </EntityCard>
          )}

          {/* Companies */}
          {formData.companies?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Companies ({formData.companies.length})</h4>
              {formData.companies.map((company, idx) => (
                <EntityCard key={idx} title="Company" index={idx}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <InfoRow label="ABN" value={company.abn} />
                    <InfoRow label="ACN" value={company.acn} />
                    <InfoRow label="TFN" value={company.tfn} />
                    <InfoRow label="GST Registered" value={company.gstRegistered ? 'Yes' : 'No'} />
                    <InfoRow label="Trading Names" value={company.tradingNames?.filter(n => n).join(', ')} fullWidth />
                    <InfoRow label="Industry Codes" value={company.asicIndustryCodes?.filter(c => c).join(', ')} fullWidth />
                    <InfoRow label="Business Address" value={company.businessAddress} fullWidth />
                    <InfoRow label="Registered Address" value={company.registeredAddress} fullWidth />
                    {!company.usePrimaryBanking && (
                      <>
                        <InfoRow label="Bank Name" value={company.bankName} />
                        <InfoRow label="Account Name" value={company.accountName} />
                        <InfoRow label="BSB" value={company.bsb} />
                        <InfoRow label="Account Number" value={company.accountNumber} />
                      </>
                    )}
                    {company.usePrimaryBanking && (
                      <div className="col-span-2">
                        <p className="text-xs text-indigo-600">Using primary banking details</p>
                      </div>
                    )}
                  </div>
                </EntityCard>
              ))}
            </div>
          )}

          {/* Trusts */}
          {formData.trusts?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Trusts ({formData.trusts.length})</h4>
              {formData.trusts.map((trust, idx) => (
                <EntityCard key={idx} title="Trust" index={idx}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <InfoRow label="ABN" value={trust.abn} />
                    <InfoRow label="TFN" value={trust.tfn} />
                    <InfoRow label="Trust Type" value={trust.trustType} />
                    <InfoRow label="GST Registered" value={trust.gstRegistered ? 'Yes' : 'No'} />
                    <InfoRow label="Trading Names" value={trust.tradingNames?.filter(n => n).join(', ')} fullWidth />
                    {!trust.usePrimaryBanking && (
                      <>
                        <InfoRow label="Bank Name" value={trust.bankName} />
                        <InfoRow label="Account Name" value={trust.accountName} />
                        <InfoRow label="BSB" value={trust.bsb} />
                        <InfoRow label="Account Number" value={trust.accountNumber} />
                      </>
                    )}
                    {trust.usePrimaryBanking && (
                      <div className="col-span-2">
                        <p className="text-xs text-indigo-600">Using primary banking details</p>
                      </div>
                    )}
                  </div>
                </EntityCard>
              ))}
            </div>
          )}

          {/* SMSFs */}
          {formData.smsfs?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">SMSFs ({formData.smsfs.length})</h4>
              {formData.smsfs.map((smsf, idx) => (
                <EntityCard key={idx} title="SMSF" index={idx}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <InfoRow label="ABN" value={smsf.abn} />
                    <InfoRow label="TFN" value={smsf.tfn} />
                    <InfoRow label="GST Registered" value={smsf.gstRegistered ? 'Yes' : 'No'} />
                    <InfoRow label="Trading Names" value={smsf.tradingNames?.filter(n => n).join(', ')} fullWidth />
                    {!smsf.usePrimaryBanking && (
                      <>
                        <InfoRow label="Bank Name" value={smsf.bankName} />
                        <InfoRow label="Account Name" value={smsf.accountName} />
                        <InfoRow label="BSB" value={smsf.bsb} />
                        <InfoRow label="Account Number" value={smsf.accountNumber} />
                      </>
                    )}
                    {smsf.usePrimaryBanking && (
                      <div className="col-span-2">
                        <p className="text-xs text-indigo-600">Using primary banking details</p>
                      </div>
                    )}
                  </div>
                </EntityCard>
              ))}
            </div>
          )}

          {/* Partnerships */}
          {formData.partnerships?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Partnerships ({formData.partnerships.length})</h4>
              {formData.partnerships.map((partnership, idx) => (
                <EntityCard key={idx} title="Partnership" index={idx}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <InfoRow label="ABN" value={partnership.abn} />
                    <InfoRow label="TFN" value={partnership.tfn} />
                    <InfoRow label="GST Registered" value={partnership.gstRegistered ? 'Yes' : 'No'} />
                    <InfoRow label="Trading Names" value={partnership.tradingNames?.filter(n => n).join(', ')} fullWidth />
                    <InfoRow label="Business Address" value={partnership.businessAddress} fullWidth />
                    {!partnership.usePrimaryBanking && (
                      <>
                        <InfoRow label="Bank Name" value={partnership.bankName} />
                        <InfoRow label="Account Name" value={partnership.accountName} />
                        <InfoRow label="BSB" value={partnership.bsb} />
                        <InfoRow label="Account Number" value={partnership.accountNumber} />
                      </>
                    )}
                    {partnership.usePrimaryBanking && (
                      <div className="col-span-2">
                        <p className="text-xs text-indigo-600">Using primary banking details</p>
                      </div>
                    )}
                  </div>
                </EntityCard>
              ))}
            </div>
          )}
        </InfoSection>
      )}

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="text-amber-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Please Review Carefully</p>
          <p>
            Make sure all the information above is correct. You can go back to any step to make changes 
            before proceeding to the final agreements and submission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
