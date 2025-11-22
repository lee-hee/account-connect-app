import React, { useState } from 'react';
import { Building2, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import BankingDetailsSelector from './BankingDetailsSelector';
import { saveBusinessEntity, deleteBusinessEntity } from '../../services/api';

const SoleTraderEntity = ({ soleTrader, handlers, formData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveSoleTrader = async () => {
    setIsSaving(true);
    // Check if we have a clientId
    if (!formData.clientId) {
      alert('Please save personal information first to generate a client ID.');
      setIsSaving(false);
      return;
    }

    // Determine if using primary banking
    const usePrimaryBanking = soleTrader.usePrimaryBanking === true;

    console.log('🔍 Determining usePrimaryBanking:', {
      'soleTrader.usePrimaryBanking': soleTrader.usePrimaryBanking,
      'Calculated usePrimaryBanking': usePrimaryBanking,
      'Banking details': {
        bankName: soleTrader.bankName,
        accountName: soleTrader.accountName,
        bsb: soleTrader.bsb,
        accountNumber: soleTrader.accountNumber
      }
    });

    // Check if banking details are missing
    if (!soleTrader.bankName || !soleTrader.accountName || !soleTrader.bsb || !soleTrader.accountNumber) {
      console.error('❌ Missing banking details:', {
        'soleTrader.usePrimaryBanking': soleTrader.usePrimaryBanking,
        'soleTrader.bankName': soleTrader.bankName,
        'soleTrader.accountName': soleTrader.accountName,
        'soleTrader.bsb': soleTrader.bsb,
        'soleTrader.accountNumber': soleTrader.accountNumber
      });

      alert('Error: Banking details are missing. Please fill in all banking information or select "Use Primary Banking Details" if you saved banking in Step 2.');
      setIsSaving(false);
      return;
    }

    // Log what we're about to send
    console.log('💾 Saving Sole Trader with data:', {
      usePrimaryBanking: soleTrader.usePrimaryBanking,
      bankingDetails: {
        bankName: soleTrader.bankName,
        accountName: soleTrader.accountName,
        bsb: soleTrader.bsb,
        accountNumber: soleTrader.accountNumber
      },
      soleTraderData: soleTrader
    });

    const result = await saveBusinessEntity('soleTrader', soleTrader, soleTrader.id, formData.clientId);

    if (result.success) {
      if (result.data?.id && !soleTrader.id) {
        handlers.updateSoleTrader('id', result.data.id);
      }
      alert('Sole Trader saved successfully!');
    } else {
      alert(`Failed to save sole trader: ${result.message}`);
    }

    setIsSaving(false);
  };

  const handleDeleteSoleTrader = async () => {
    // Only allow delete if sole trader has been saved (has an ID)
    if (!soleTrader.id) {
      alert('Please save the sole trader before deleting it, or use the Remove button to discard unsaved changes.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete the sole trader?')) {
      return;
    }

    setIsDeleting(true);

    const result = await deleteBusinessEntity('soleTrader', soleTrader.id);

    if (result.success) {
      handlers.removeSoleTrader();
      alert('Sole Trader deleted successfully!');
    } else {
      alert(`Failed to delete sole trader: ${result.message}`);
    }

    setIsDeleting(false);
  };

  return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <Building2 className="mr-2" size={20} />
            Sole Trader {soleTrader && <span className="ml-2 text-sm text-green-600">(Active)</span>}
            {soleTrader?.id && <span className="ml-2 text-xs text-green-600">(Saved)</span>}
          </h3>
          {!soleTrader ? (
              <button
                  type="button"
                  onClick={handlers.addSoleTrader}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                <Plus size={16} className="mr-1" /> Add
              </button>
          ) : (
              <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleSaveSoleTrader}
                    disabled={isSaving}
                    className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                >
                  {isSaving ? (
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
                    onClick={handleDeleteSoleTrader}
                    disabled={isDeleting || !soleTrader?.id}
                    className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!soleTrader?.id ? "Save the sole trader first before deleting" : "Delete sole trader"}
                >
                  {isDeleting ? (
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
          )}
        </div>

        {soleTrader && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ABN <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      value={soleTrader.abn}
                      onChange={(e) => handlers.updateSoleTrader('abn', e.target.value)}
                      placeholder="11 digits"
                      maxLength="11"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={soleTrader.gstRegistered}
                        onChange={(e) => handlers.updateSoleTrader('gstRegistered', e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">GST Registered</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trading Names</label>
                {soleTrader.tradingNames.map((name, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                          type="text"
                          value={name}
                          onChange={(e) => handlers.updateTradingName(idx, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Trading name"
                      />
                      {soleTrader.tradingNames.length > 1 && (
                          <button
                              type="button"
                              onClick={() => handlers.removeTradingName(idx)}
                              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                      )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handlers.addTradingName}
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  <Plus size={14} className="mr-1" /> Add Trading Name
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <textarea
                      value={soleTrader.businessAddress}
                      onChange={(e) => handlers.updateSoleTrader('businessAddress', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registered Address</label>
                  <textarea
                      value={soleTrader.registeredAddress}
                      onChange={(e) => handlers.updateSoleTrader('registeredAddress', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Banking Information Section */}
              <BankingDetailsSelector
                  entity={soleTrader}
                  formData={formData}
                  onUpdate={handlers.updateSoleTrader}
                  entityType="Sole Trader"
                  allowPrimaryBanking={true}
              />
            </div>
        )}
      </div>
  );
};

export default SoleTraderEntity;