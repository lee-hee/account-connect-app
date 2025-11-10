import React from 'react';

const FinancialDetailsStep = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Financial Details</h2>
      
      {/* Bank Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Bank Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName || ''}
              onChange={handleInputChange}
              placeholder="e.g., Commonwealth Bank"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName || ''}
              onChange={handleInputChange}
              placeholder="Account holder name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.accountName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BSB <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bsb"
              value={formData.bsb || ''}
              onChange={handleInputChange}
              placeholder="XXX-XXX"
              maxLength="7"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.bsb ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bsb && <p className="text-red-500 text-xs mt-1">{errors.bsb}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber || ''}
              onChange={handleInputChange}
              placeholder="Account number"
              maxLength="10"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.accountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
          </div>
        </div>
      </div>

      {/* Income Streams */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Income Streams (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cryptocurrency */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                name="hasCrypto"
                checked={formData.hasCrypto || false}
                onChange={handleInputChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Cryptocurrency</span>
            </label>
            
            {formData.hasCrypto && (
              <select
                name="cryptoType"
                value={formData.cryptoType || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">Select type</option>
                <option value="BITCOIN">Bitcoin</option>
                <option value="ETHEREUM">Ethereum</option>
                <option value="BINANCE_COIN">Binance Coin</option>
                <option value="SOLANA">Solana</option>
                <option value="MULTIPLE">Multiple</option>
                <option value="OTHER">Other</option>
              </select>
            )}
          </div>

          {/* Investment Property */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="hasInvestmentProperty"
                checked={formData.hasInvestmentProperty || false}
                onChange={handleInputChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Investment Property</span>
            </label>
          </div>

          {/* Stocks */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="hasStocks"
                checked={formData.hasStocks || false}
                onChange={handleInputChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Stocks</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDetailsStep;
