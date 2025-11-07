import React, { useState } from 'react';
import { Building2, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import BankingDetailsSelector from './BankingDetailsSelector';
import { saveBusinessEntity, deleteBusinessEntity } from '../../services/api';

const CompanyEntity = ({ companies, handlers, formData }) => {
  const [savingIndex, setSavingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleSaveCompany = async (index) => {
    const company = companies[index];
    setSavingIndex(index);
    
    const result = await saveBusinessEntity('company', company, company.id);
    
    if (result.success) {
      // Update the company with the returned ID if it's a new entity
      if (result.data?.id && !company.id) {
        handlers.updateCompany(index, 'id', result.data.id);
      }
      alert('Company saved successfully!');
    } else {
      alert(`Failed to save company: ${result.message}`);
    }
    
    setSavingIndex(null);
  };

  const handleDeleteCompany = async (index) => {
    const company = companies[index];
    
    if (!company.id) {
      // If no ID, just remove from UI (not saved to backend yet)
      handlers.removeCompany(index);
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }
    
    setDeletingIndex(index);
    
    const result = await deleteBusinessEntity('company', company.id);
    
    if (result.success) {
      handlers.removeCompany(index);
      alert('Company deleted successfully!');
    } else {
      alert(`Failed to delete company: ${result.message}`);
    }
    
    setDeletingIndex(null);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <Building2 className="mr-2" size={20} />
          Companies ({companies.length})
        </h3>
        <button
          type="button"
          onClick={handlers.addCompany}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          <Plus size={16} className="mr-1" /> Add Company
        </button>
      </div>
      
      {companies.map((company, idx) => (
        <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">
              Company {idx + 1} 
              {company.id && <span className="ml-2 text-xs text-green-600">(Saved)</span>}
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSaveCompany(idx)}
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
                onClick={() => handleDeleteCompany(idx)}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ABN</label>
                <input
                  type="text"
                  value={company.abn}
                  onChange={(e) => handlers.updateCompany(idx, 'abn', e.target.value)}
                  maxLength="11"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ACN</label>
                <input
                  type="text"
                  value={company.acn}
                  onChange={(e) => handlers.updateCompany(idx, 'acn', e.target.value)}
                  maxLength="9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">TFN</label>
                <input
                  type="text"
                  value={company.tfn}
                  onChange={(e) => handlers.updateCompany(idx, 'tfn', e.target.value)}
                  maxLength="9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={company.gstRegistered}
                  onChange={(e) => handlers.updateCompany(idx, 'gstRegistered', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">GST Registered</span>
              </label>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Trading Names</label>
              {company.tradingNames.map((name, nameIdx) => (
                <div key={nameIdx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handlers.updateListItem(idx, 'tradingNames', nameIdx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {company.tradingNames.length > 1 && (
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
              <label className="block text-xs font-medium text-gray-700 mb-1">ASIC Industry Codes</label>
              {company.asicIndustryCodes.map((code, codeIdx) => (
                <div key={codeIdx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => handlers.updateListItem(idx, 'asicIndustryCodes', codeIdx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {company.asicIndustryCodes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handlers.removeListItem(idx, 'asicIndustryCodes', codeIdx)}
                      className="px-2 py-2 bg-red-500 text-white rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handlers.addListItem(idx, 'asicIndustryCodes')}
                className="text-xs text-indigo-600 hover:text-indigo-700"
              >
                + Add Industry Code
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Address</label>
                <textarea
                  value={company.businessAddress}
                  onChange={(e) => handlers.updateCompany(idx, 'businessAddress', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Registered Address</label>
                <textarea
                  value={company.registeredAddress}
                  onChange={(e) => handlers.updateCompany(idx, 'registeredAddress', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Banking Information Section */}
            <BankingDetailsSelector
              entity={company}
              formData={formData}
              onUpdate={(field, value) => handlers.updateCompany(idx, field, value)}
              entityType="Company"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyEntity;
