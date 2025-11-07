import React, { useState } from 'react';
import { User, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import BankingDetailsSelector from './BankingDetailsSelector';
import { saveBusinessEntity, deleteBusinessEntity } from '../../services/api';

const PartnershipEntity = ({ partnerships, handlers, formData }) => {
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleSavePartnership = async (index) => {
    const partnership = partnerships[index];
    setSavingIndex(index);
    
    const result = await saveBusinessEntity('partnership', partnership, partnership.id);
    
    if (result.success) {
      if (result.data?.id && !partnership.id) {
        handlers.updatePartnership(index, 'id', result.data.id);
      }
      alert('Partnership saved successfully!');
    } else {
      alert(`Failed to save partnership: ${result.message}`);
    }
    
    setSavingIndex(null);
  };

  const handleDeletePartnership = async (index) => {
    const partnership = partnerships[index];

    // Only allow delete if partnership has been saved (has an ID)
    if (!partnership.id) {
      alert('Please save the partnership before deleting it, or use the Remove button to discard unsaved changes.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this partnership?')) {
      return;
    }

    setDeletingIndex(index);

    const result = await deleteBusinessEntity('partnership', partnership.id);

    if (result.success) {
      handlers.removePartnership(index);
      alert('Partnership deleted successfully!');
    } else {
      alert(`Failed to delete partnership: ${result.message}`);
    }

    setDeletingIndex(null);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <User className="mr-2" size={20} />
          Partnerships ({partnerships.length})
        </h3>
        <button
          type="button"
          onClick={handlers.addPartnership}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          <Plus size={16} className="mr-1" /> Add Partnership
        </button>
      </div>
      
      {partnerships.map((partnership, idx) => (
        <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">
              Partnership {idx + 1}
              {partnership.id && <span className="ml-2 text-xs text-green-600">(Saved)</span>}
            </h4>
            <div className="flex gap-2">
              <button
                  type="button"
                  onClick={() => handleSavePartnership(idx)}
                  disabled={savingIndex === idx}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
              >
                {savingIndex === idx ? (
                    <>
                      <Loader2 size={14} className="mr-1 animate-spin"/>
                      Saving...
                    </>
                ) : (
                    <>
                      <Save size={14} className="mr-1"/>
                      Save
                    </>
                )}
              </button>
              <button
                  type="button"
                  onClick={() => handleDeletePartnership(idx)}
                  disabled={deletingIndex === idx || !partnership.id}
                  className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!partnership.id ? "Save the partnership first before deleting" : "Delete partnership"}
              >
                {deletingIndex === idx ? (
                    <>
                      <Loader2 size={14} className="mr-1 animate-spin"/>
                      Deleting...
                    </>
                ) : (
                    <>
                      <Trash2 size={14} className="mr-1"/>
                      Delete
                    </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ABN</label>
                <input
                    type="text"
                    value={partnership.abn}
                    onChange={(e) => handlers.updatePartnership(idx, 'abn', e.target.value)}
                    maxLength="11"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">TFN</label>
                <input
                  type="text"
                  value={partnership.tfn}
                  onChange={(e) => handlers.updatePartnership(idx, 'tfn', e.target.value)}
                  maxLength="9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={partnership.gstRegistered}
                  onChange={(e) => handlers.updatePartnership(idx, 'gstRegistered', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">GST Registered</span>
              </label>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Trading Names</label>
              {partnership.tradingNames.map((name, nameIdx) => (
                <div key={nameIdx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handlers.updateListItem(idx, 'tradingNames', nameIdx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {partnership.tradingNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handlers.removeListItem(idx, 'tradingNames', nameIdx)}
                      className="px-2 py-2 bg-red-500 text-white rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handlers.addListItem(idx, 'tradingNames')}
                className="text-xs text-indigo-600 hover:text-indigo-700"
              >
                + Add Trading Name
              </button>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Business Address</label>
              <textarea
                value={partnership.businessAddress}
                onChange={(e) => handlers.updatePartnership(idx, 'businessAddress', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <BankingDetailsSelector
              entity={partnership}
              formData={formData}
              onUpdate={(field, value) => handlers.updatePartnership(idx, field, value)}
              entityType="Partnership"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartnershipEntity;
