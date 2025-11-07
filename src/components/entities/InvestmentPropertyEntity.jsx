import React, { useState } from 'react';
import { Home, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { saveBusinessEntity, deleteBusinessEntity } from '../../services/api';

const InvestmentPropertyEntity = ({ properties, handlers }) => {
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleSaveProperty = async (index) => {
    const property = properties[index];
    setSavingIndex(index);
    
    const result = await saveBusinessEntity('property', property, property.id);
    
    if (result.success) {
      if (result.data?.id && !property.id) {
        handlers.updateProperty(index, 'id', result.data.id);
      }
      alert('Investment property saved successfully!');
    } else {
      alert(`Failed to save property: ${result.message}`);
    }
    
    setSavingIndex(null);
  };

  const handleDeleteProperty = async (index) => {
    const property = properties[index];
    
    if (!property.id) {
      // If no ID, just remove from UI (not saved to backend yet)
      handlers.removeProperty(index);
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this investment property?')) {
      return;
    }
    
    setDeletingIndex(index);
    
    const result = await deleteBusinessEntity('property', property.id);
    
    if (result.success) {
      handlers.removeProperty(index);
      alert('Investment property deleted successfully!');
    } else {
      alert(`Failed to delete property: ${result.message}`);
    }
    
    setDeletingIndex(null);
  };

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
            <h4 className="font-medium text-gray-700">
              Property {idx + 1}
              {property.id && <span className="ml-2 text-xs text-green-600">(Saved)</span>}
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSaveProperty(idx)}
                disabled={savingIndex === idx}
                className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
              >
                {savingIndex === idx ? (
                  <>
                    <Loader2 size={14} className="mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} className="mr-1" />
                    Save
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProperty(idx)}
                disabled={deletingIndex === idx}
                className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
              >
                {deletingIndex === idx ? (
                  <>
                    <Loader2 size={14} className="mr-1 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </>
                )}
              </button>
            </div>
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
