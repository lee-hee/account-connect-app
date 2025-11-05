import React from 'react';
import { User, Plus, Trash2 } from 'lucide-react';

const PartnershipEntity = ({ partnerships, handlers }) => {
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
            <h4 className="font-medium text-gray-700">Partnership {idx + 1}</h4>
            <button
              type="button"
              onClick={() => handlers.removePartnership(idx)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartnershipEntity;
