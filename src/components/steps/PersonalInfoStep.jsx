import React from 'react';

const PersonalInfoStep = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-base font-semibold text-gray-800 mb-2">Personal Information</h2>
      
      {/* Personal Details Section */}
      <div className="p-2 border border-gray-200 rounded bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-700 mb-1.5">Personal Details</h3>
        
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-0.5">{errors.firstName}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Middle Name (Optional)</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-0.5">{errors.lastName}</p>}
        </div>
      </div>

      {/* Date of Birth and TFN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
              errors.dob ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dob && <p className="text-red-500 text-xs mt-0.5">{errors.dob}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Tax File Number (TFN) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tfn"
            value={formData.tfn}
            onChange={handleInputChange}
            placeholder="123456789"
            maxLength="9"
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
              errors.tfn ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.tfn && <p className="text-red-500 text-xs mt-0.5">{errors.tfn}</p>}
        </div>
      </div>

      {/* Email and Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleInputChange}
            placeholder="+61 XXX XXX XXX"
            className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
              errors.contactNo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contactNo && <p className="text-red-500 text-xs mt-0.5">{errors.contactNo}</p>}
        </div>
      </div>
      </div>

      {/* Bank Details Section */}
      <div className="p-2 border border-gray-200 rounded bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-700 mb-1.5">Bank Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName || ''}
              onChange={handleInputChange}
              placeholder="e.g., Commonwealth Bank"
              className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bankName && <p className="text-red-500 text-xs mt-0.5">{errors.bankName}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName || ''}
              onChange={handleInputChange}
              placeholder="Account holder name"
              className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
                errors.accountName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountName && <p className="text-red-500 text-xs mt-0.5">{errors.accountName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1.5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              BSB <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bsb"
              value={formData.bsb || ''}
              onChange={handleInputChange}
              placeholder="XXX-XXX"
              maxLength="7"
              className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
                errors.bsb ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bsb && <p className="text-red-500 text-xs mt-0.5">{errors.bsb}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber || ''}
              onChange={handleInputChange}
              placeholder="Account number"
              maxLength="10"
              className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-indigo-500 ${
                errors.accountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-0.5">{errors.accountNumber}</p>}
          </div>
        </div>
      </div>

      {/* Income Streams Section */}
      <div className="p-2 border border-gray-200 rounded bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-700 mb-1.5">Income Streams (Optional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Cryptocurrency */}
          <div>
            <label className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                name="hasCrypto"
                checked={formData.hasCrypto || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-gray-700">Cryptocurrency</span>
            </label>
            
            {formData.hasCrypto && (
              <select
                name="cryptoType"
                value={formData.cryptoType || ''}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 mt-1"
              >
                <option value="">Select</option>
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
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hasInvestmentProperty"
                checked={formData.hasInvestmentProperty || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-gray-700">Investment Property</span>
            </label>
          </div>

          {/* Stocks */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hasStocks"
                checked={formData.hasStocks || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-gray-700">Stocks</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
