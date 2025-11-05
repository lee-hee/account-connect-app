import React from 'react';
import { Home, Plus, Trash2 } from 'lucide-react';

const InvestmentPropertyEntity = ({ properties, handlers }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <Home className="mr-2" size={20} />
          Investment Properties ({properties.length})
        </h3>
        <button
          type="button"
          onClick={handlers.addProperty}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          <Plus size={16} className="mr-1" /> Add Property
        </button>
      </div>
      
      {properties.map((property, idx) => (
        <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Property {idx + 1}</h4>
            <button
              type="button"
              onClick={() => handlers.removeProperty(idx)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={property.address}
                onChange={(e) => handlers.updateProperty(idx, 'address', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Property address"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Purchase Value ($)</label>
                <input
                  type="number"
                  value={property.purchaseValue}
                  onChange={(e) => handlers.updateProperty(idx, 'purchaseValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mortgage Lender Name</label>
                <input
                  type="text"
                  value={property.mortgageLenderName}
                  onChange={(e) => handlers.updateProperty(idx, 'mortgageLenderName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Lender name"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestmentPropertyEntity;
