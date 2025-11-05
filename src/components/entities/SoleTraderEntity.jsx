import React from 'react';
import { Building2, Plus, Trash2 } from 'lucide-react';

const SoleTraderEntity = ({ soleTrader, handlers }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <Building2 className="mr-2" size={20} />
          Sole Trader {soleTrader && <span className="ml-2 text-sm text-green-600">(Active)</span>}
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
          <button
            type="button"
            onClick={handlers.removeSoleTrader}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            <Trash2 size={16} className="mr-1" /> Remove
          </button>
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
        </div>
      )}
    </div>
  );
};

export default SoleTraderEntity;
