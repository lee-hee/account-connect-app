import React, { useEffect } from 'react';

const BankingDetailsSelector = ({
                                  entity,
                                  formData,
                                  onUpdate,
                                  entityType = 'entity',
                                  allowPrimaryBanking = false // Only true for Sole Trader
                                }) => {
  // Initialize banking details if usePrimaryBanking is true but banking fields are empty
  useEffect(() => {
    if (allowPrimaryBanking && entity.usePrimaryBanking && !entity.bankName) {
      const bankName = formData.bankingInfo?.bankName || formData.bankName || '';
      const accountName = formData.bankingInfo?.accountName || formData.accountName || '';
      const bsb = formData.bankingInfo?.bsb || formData.bsb || '';
      const accountNumber = formData.bankingInfo?.accountNumber || formData.accountNumber || '';

      console.log('🔧 Initializing banking details on mount:', {
        'entity.usePrimaryBanking': entity.usePrimaryBanking,
        'entity.bankName': entity.bankName,
        'Copying from formData': { bankName, accountName, bsb, accountNumber }
      });

      if (bankName || accountName || bsb || accountNumber) {
        onUpdate('bankName', bankName);
        onUpdate('accountName', accountName);
        onUpdate('bsb', bsb);
        onUpdate('accountNumber', accountNumber);
        console.log('✅ Initialized banking details');
      }
    }
  }, [allowPrimaryBanking, entity.usePrimaryBanking, entity.bankName, formData.bankingInfo, formData.bankName, formData.accountName, formData.bsb, formData.accountNumber, onUpdate]);

  const handleBankingOptionChange = (e) => {
    const value = e.target.value;
    const usePrimary = value === 'primary';

    console.log('🔄 Banking option change:', {
      value,
      usePrimary,
      'formData.bankingInfo': formData.bankingInfo,
      'formData banking fields': {
        bankName: formData.bankName,
        accountName: formData.accountName,
        bsb: formData.bsb,
        accountNumber: formData.accountNumber
      }
    });

    onUpdate('usePrimaryBanking', usePrimary);

    if (usePrimary) {
      // Copy primary banking details (backend will handle matching/linking)
      const bankName = formData.bankingInfo?.bankName || formData.bankName || '';
      const accountName = formData.bankingInfo?.accountName || formData.accountName || '';
      const bsb = formData.bankingInfo?.bsb || formData.bsb || '';
      const accountNumber = formData.bankingInfo?.accountNumber || formData.accountNumber || '';

      onUpdate('bankName', bankName);
      onUpdate('accountName', accountName);
      onUpdate('bsb', bsb);
      onUpdate('accountNumber', accountNumber);

      console.log('✅ Copied primary banking details:', {
        bankName,
        accountName,
        bsb,
        accountNumber
      });
    } else {
      // Clear banking fields for new entry
      onUpdate('bankName', '');
      onUpdate('accountName', '');
      onUpdate('bsb', '');
      onUpdate('accountNumber', '');
    }
  };

  return (
      <div className="border-t border-gray-300 pt-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Banking Information</h4>

        {allowPrimaryBanking && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Banking Details
              </label>
              <select
                  value={entity.usePrimaryBanking ? 'primary' : 'new'}
                  onChange={handleBankingOptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="primary">Use Primary Banking Details (from Financial Details)</option>
                <option value="new">Add New Banking Details for this {entityType}</option>
              </select>
            </div>
        )}

        {allowPrimaryBanking && entity.usePrimaryBanking && (formData.bankingInfo || formData.bankName) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800 font-medium mb-2">Primary Banking Details</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-900">
                <div><strong>Bank:</strong> {formData.bankingInfo?.bankName || formData.bankName}</div>
                <div><strong>Account Name:</strong> {formData.bankingInfo?.accountName || formData.accountName}</div>
                <div><strong>BSB:</strong> {formData.bankingInfo?.bsb || formData.bsb}</div>
                <div><strong>Account Number:</strong> {formData.bankingInfo?.accountNumber || formData.accountNumber}</div>
              </div>
            </div>
        )}

        {(!allowPrimaryBanking || !entity.usePrimaryBanking) && (
            <div className="space-y-3">
              {!allowPrimaryBanking && (
                  <p className="text-xs text-gray-600 mb-3 bg-yellow-50 border border-yellow-200 rounded p-2">
                    <strong>Note:</strong> Each {entityType} requires its own separate banking account.
                  </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      value={entity.bankName || ''}
                      onChange={(e) => onUpdate('bankName', e.target.value)}
                      placeholder="e.g., Commonwealth Bank"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      value={entity.accountName || ''}
                      onChange={(e) => onUpdate('accountName', e.target.value)}
                      placeholder="Account holder name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    BSB <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      value={entity.bsb || ''}
                      onChange={(e) => onUpdate('bsb', e.target.value)}
                      placeholder="XXX-XXX"
                      maxLength="7"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      value={entity.accountNumber || ''}
                      onChange={(e) => onUpdate('accountNumber', e.target.value)}
                      placeholder="Account number"
                      maxLength="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default BankingDetailsSelector;