import React, { useState } from 'react';
import { Landmark, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import BankingDetailsSelector from './BankingDetailsSelector';
import { saveBusinessEntity, deleteBusinessEntity } from '../../services/api';

const TrustEntity = ({ trusts, handlers, formData }) => {
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleSaveTrust = async (index) => {
    const trust = trusts[index];
    // Check if we have a clientId
    if (!formData.clientId) {
      alert('Please save personal information first to generate a client ID.');
      return;
    }
    setSavingIndex(index);

    const result = await saveBusinessEntity('trust', trust, trust.id,formData.clientId);

    if (result.success) {
      if (result.data?.id && !trust.id) {
        handlers.updateTrust(index, 'id', result.data.id);
      }
      alert('Trust saved successfully!');
    } else {
      alert(`Failed to save trust: ${result.message}`);
    }

    setSavingIndex(null);
  };

  const handleDeleteTrust = async (index) => {
    const trust = trusts[index];

    // Only allow delete if trust has been saved (has an ID)
    if (!trust.id) {
      alert('Please save the trust before deleting it, or use the Remove button to discard unsaved changes.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this trust?')) {
      return;
    }

    setDeletingIndex(index);

    const result = await deleteBusinessEntity('trust', trust.id);

    if (result.success) {
      handlers.removeTrust(index);
      alert('Trust deleted successfully!');
    } else {
      alert(`Failed to delete trust: ${result.message}`);
    }

    setDeletingIndex(null);
  };

  return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <Landmark className="mr-2" size={20} />
            Trusts ({trusts.length})
          </h3>
          <button
              type="button"
              onClick={handlers.addTrust}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
          >
            <Plus size={16} className="mr-1" /> Add Trust
          </button>
        </div>

        {trusts.map((trust, idx) => (
            <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">
                  Trust {idx + 1}
                  {trust.id && <span className="ml-2 text-xs text-green-600">(Saved)</span>}
                </h4>
                <div className="flex gap-2">
                  <button
                      type="button"
                      onClick={() => handleSaveTrust(idx)}
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
                      onClick={() => handleDeleteTrust(idx)}
                      disabled={deletingIndex === idx || !trust.id}
                      className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!trust.id ? "Save the trust first before deleting" : "Delete trust"}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ABN</label>
                    <input
                        type="text"
                        value={trust.abn}
                        onChange={(e) => handlers.updateTrust(idx, 'abn', e.target.value)}
                        maxLength="11"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">TFN</label>
                    <input
                        type="text"
                        value={trust.tfn}
                        onChange={(e) => handlers.updateTrust(idx, 'tfn', e.target.value)}
                        maxLength="9"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Trust Type</label>
                    <select
                        value={trust.trustType}
                        onChange={(e) => handlers.updateTrust(idx, 'trustType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="DISCRETIONARY">Discretionary</option>
                      <option value="UNIT">Unit</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={trust.gstRegistered}
                        onChange={(e) => handlers.updateTrust(idx, 'gstRegistered', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">GST Registered</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trading Names</label>
                  {trust.tradingNames.map((name, nameIdx) => (
                      <div key={nameIdx} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handlers.updateListItem(idx, 'tradingNames', nameIdx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        {trust.tradingNames.length > 1 && (
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

                <BankingDetailsSelector
                    entity={trust}
                    formData={formData}
                    onUpdate={(field, value) => handlers.updateTrust(idx, field, value)}
                    entityType="Trust"
                    allowPrimaryBanking={false}
                />
              </div>
            </div>
        ))}
      </div>
  );
};

export default TrustEntity;