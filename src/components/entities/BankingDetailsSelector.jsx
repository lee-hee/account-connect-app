import React from 'react';

const BankingDetailsSelector = ({ 
  entity, 
  formData, 
  onUpdate, 
  entityType = 'entity'
}) => {
  const handleBankingOptionChange = (e) => {
    const value = e.target.value;
    const usePrimary = value === 'primary';
    
    onUpdate('usePrimaryBanking', usePrimary);
    
    if (usePrimary) {
      // Copy primary banking details
      onUpdate('bankName', formData.bankName || '');
      onUpdate('accountName', formData.accountName || '');
      onUpdate('bsb', formData.bsb || '');
      onUpdate('accountNumber', formData.accountNumber || '');
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

      {entity.usePrimaryBanking && formData.bankName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800 font-medium mb-2">Primary Banking Details:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-900">
            <div><strong>Bank:</strong> {formData.bankName}</div>
            <div><strong>Account Name:</strong> {formData.accountName}</div>
            <div><strong>BSB:</strong> {formData.bsb}</div>
            <div><strong>Account Number:</strong> {formData.accountNumber}</div>
          </div>
        </div>
      )}

      {!entity.usePrimaryBanking && (
        <div className="space-y-3">
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
