import React from 'react';

const AddressStep = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Address & Residency</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Residential Address</label>
        <textarea
          name="addressResidential"
          value={formData.addressResidential}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your residential address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Address</label>
        <textarea
          name="addressPostal"
          value={formData.addressPostal}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your postal address (if different)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Residency Status <span className="text-red-500">*</span>
        </label>
        <select
          name="residencyStatus"
          value={formData.residencyStatus}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors.residencyStatus ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select residency status</option>
          <option value="CITIZEN">Australian Citizen</option>
          <option value="PR">Permanent Resident</option>
          <option value="OVERSEAS">Overseas Resident</option>
        </select>
        {errors.residencyStatus && <p className="text-red-500 text-xs mt-1">{errors.residencyStatus}</p>}
      </div>
    </div>
  );
};

export default AddressStep;