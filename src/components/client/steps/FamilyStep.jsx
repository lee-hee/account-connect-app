import React from 'react';

const FamilyStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Family Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Dependent Children</label>
        <input
          type="number"
          name="noOfDependentChildren"
          value={formData.noOfDependentChildren}
          onChange={handleInputChange}
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Name</label>
          <input
            type="text"
            name="spouseName"
            value={formData.spouseName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Date of Birth</label>
          <input
            type="date"
            name="spouseDob"
            value={formData.spouseDob}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyStep;