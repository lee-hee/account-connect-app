export const useCompanies = (formData, setFormData) => {
  const addCompany = () => {
    setFormData(prev => ({
      ...prev,
      companies: [...prev.companies, {
        abn: '',
        acn: '',
        gstRegistered: false,
        businessAddress: '',
        registeredAddress: '',
        tfn: '',
        tradingNames: [''],
        asicIndustryCodes: [''],
        usePrimaryBanking: true,
        bankName: prev.bankName || '',
        accountName: prev.accountName || '',
        bsb: prev.bsb || '',
        accountNumber: prev.accountNumber || ''
      }]
    }));
  };

  const removeCompany = (index) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.filter((_, i) => i !== index)
    }));
  };

  const updateCompany = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.map((company, i) => 
        i === index ? { ...company, [field]: value } : company
      )
    }));
  };

  const addListItem = (index, listField) => {
    setFormData(prev => {
      const updatedCompanies = prev.companies.map((company, i) => {
        if (i === index) {
          return { ...company, [listField]: [...company[listField], ''] };
        }
        return company;
      });
      return { ...prev, companies: updatedCompanies };
    });
  };

  const updateListItem = (companyIndex, listField, itemIndex, value) => {
    setFormData(prev => {
      const updatedCompanies = prev.companies.map((company, i) => {
        if (i === companyIndex) {
          const updatedList = company[listField].map((item, j) => j === itemIndex ? value : item);
          return { ...company, [listField]: updatedList };
        }
        return company;
      });
      return { ...prev, companies: updatedCompanies };
    });
  };

  const removeListItem = (companyIndex, listField, itemIndex) => {
    setFormData(prev => {
      const updatedCompanies = prev.companies.map((company, i) => {
        if (i === companyIndex) {
          const updatedList = company[listField].filter((_, j) => j !== itemIndex);
          return { ...company, [listField]: updatedList };
        }
        return company;
      });
      return { ...prev, companies: updatedCompanies };
    });
  };

  return {
    addCompany,
    removeCompany,
    updateCompany,
    addListItem,
    updateListItem,
    removeListItem
  };
};
