import React, { useState } from 'react';
import { Landmark, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import BankingDetailsSelector from './BankingDetailsSelector';
import { saveBusinessEntity, deleteBusinessEntity } from '../../services/api';

const SMSFEntity = ({ smsfs, handlers, formData }) => {
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleSaveSMSF = async (index) => {
    const smsf = smsfs[index];

    // Check if we have a clientId
    if (!formData.clientId) {
      alert('Please save personal information first to generate a client ID.');
      return;
    }

    setSavingIndex(index);

    const result = await saveBusinessEntity('smsf', smsf, smsf.id,formData.clientId);

    if (result.success) {
      if (result.data?.id && !smsf.id) {
        handlers.updateSMSF(index, 'id', result.data.id);
      }
      alert('SMSF saved successfully!');
    } else {
      alert(`Failed to save SMSF: ${result.message}`);
    }

    setSavingIndex(null);
  };

  const handleDeleteSMSF = async (index) => {
    const smsf = smsfs[index];

    // Only allow delete if SMSF has been saved (has an ID)
    if (!smsf.id) {
      alert('Please save the SMSF before deleting it, or use the Remove button to discard unsaved changes.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this SMSF?')) {
      return;
    }

    setDeletingIndex(index);

    const result = await deleteBusinessEntity('smsf', smsf.id);

    if (result.success) {
      handlers.removeSMSF(index);
      alert('SMSF deleted successfully!');
    } else {
      alert(`Failed to delete SMSF: ${result.message}`);
    }

    setDeletingIndex(null);
  };

  return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <Landmark className="mr-2" size={20} />
            SMSFs ({smsfs.length})
          </h3>
          <button
              type="button"
              onClick={handlers.addSMSF}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
          >
            <Plus size={16} className="mr-1" /> Add SMSF
          </button>
        </div>

        {smsfs.map((smsf, idx) => (
            <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">
                  SMSF {idx + 1}
                  {smsf.id && <span className="ml-2 text-xs text-green-600">(Saved)</span>}
                </h4>
                <div className="flex gap-2">
                  <button
                      type="button"
                      onClick={() => handleSaveSMSF(idx)}
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
                      onClick={() => handleDeleteSMSF(idx)}
                      disabled={deletingIndex === idx || !smsf.id}
                      className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!smsf.id ? "Save the SMSF first before deleting" : "Delete SMSF"}
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
                        value={smsf.abn}
                        onChange={(e) => handlers.updateSMSF(idx, 'abn', e.target.value)}
                        maxLength="11"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">TFN</label>
                    <input
                        type="text"
                        value={smsf.tfn}
                        onChange={(e) => handlers.updateSMSF(idx, 'tfn', e.target.value)}
                        maxLength="9"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={smsf.gstRegistered}
                        onChange={(e) => handlers.updateSMSF(idx, 'gstRegistered', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">GST Registered</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trading Names</label>
                  {smsf.tradingNames.map((name, nameIdx) => (
                      <div key={nameIdx} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handlers.updateListItem(idx, 'tradingNames', nameIdx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        {smsf.tradingNames.length > 1 && (
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
                    entity={smsf}
                    formData={formData}
                    onUpdate={(field, value) => handlers.updateSMSF(idx, field, value)}
                    entityType="SMSF"
                    allowPrimaryBanking={false}
                />
              </div>
            </div>
        ))}
      </div>
  );
};

export default SMSFEntity;