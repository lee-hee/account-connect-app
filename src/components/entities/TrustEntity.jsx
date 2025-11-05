import React from 'react';
import { Landmark, Plus, Trash2 } from 'lucide-react';

const TrustEntity = ({ trusts, handlers }) => {
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
            <h4 className="font-medium text-gray-700">Trust {idx + 1}</h4>
            <button
              type="button"
              onClick={() => handlers.removeTrust(idx)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustEntity;
