export const useTrusts = (formData, setFormData) => {
  const addTrust = () => {
    setFormData(prev => ({
      ...prev,
      trusts: [...prev.trusts, {
        abn: '',
        gstRegistered: false,
        trustType: '',
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

  const removeTrust = (index) => {
    setFormData(prev => ({
      ...prev,
      trusts: prev.trusts.filter((_, i) => i !== index)
    }));
  };

  const updateTrust = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      trusts: prev.trusts.map((trust, i) => 
        i === index ? { ...trust, [field]: value } : trust
      )
    }));
  };

  const addListItem = (index, listField) => {
    setFormData(prev => {
      const updatedTrusts = prev.trusts.map((trust, i) => {
        if (i === index) {
          return { ...trust, [listField]: [...trust[listField], ''] };
        }
        return trust;
      });
      return { ...prev, trusts: updatedTrusts };
    });
  };

  const updateListItem = (trustIndex, listField, itemIndex, value) => {
    setFormData(prev => {
      const updatedTrusts = prev.trusts.map((trust, i) => {
        if (i === trustIndex) {
          const updatedList = trust[listField].map((item, j) => j === itemIndex ? value : item);
          return { ...trust, [listField]: updatedList };
        }
        return trust;
      });
      return { ...prev, trusts: updatedTrusts };
    });
  };

  const removeListItem = (trustIndex, listField, itemIndex) => {
    setFormData(prev => {
      const updatedTrusts = prev.trusts.map((trust, i) => {
        if (i === trustIndex) {
          const updatedList = trust[listField].filter((_, j) => j !== itemIndex);
          return { ...trust, [listField]: updatedList };
        }
        return trust;
      });
      return { ...prev, trusts: updatedTrusts };
    });
  };

  return {
    addTrust,
    removeTrust,
    updateTrust,
    addListItem,
    updateListItem,
    removeListItem
  };
};
