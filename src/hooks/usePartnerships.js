export const usePartnerships = (formData, setFormData) => {
  const addPartnership = () => {
    setFormData(prev => ({
      ...prev,
      partnerships: [...prev.partnerships, {
        abn: '',
        gstRegistered: false,
        businessAddress: '',
        tfn: '',
        tradingNames: [''],
        usePrimaryBanking: true,
        bankName: prev.bankName || '',
        accountName: prev.accountName || '',
        bsb: prev.bsb || '',
        accountNumber: prev.accountNumber || ''
      }]
    }));
  };

  const removePartnership = (index) => {
    setFormData(prev => ({
      ...prev,
      partnerships: prev.partnerships.filter((_, i) => i !== index)
    }));
  };

  const updatePartnership = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      partnerships: prev.partnerships.map((partnership, i) => 
        i === index ? { ...partnership, [field]: value } : partnership
      )
    }));
  };

  const addListItem = (index, listField) => {
    setFormData(prev => {
      const updatedPartnerships = prev.partnerships.map((partnership, i) => {
        if (i === index) {
          return { ...partnership, [listField]: [...partnership[listField], ''] };
        }
        return partnership;
      });
      return { ...prev, partnerships: updatedPartnerships };
    });
  };

  const updateListItem = (partnershipIndex, listField, itemIndex, value) => {
    setFormData(prev => {
      const updatedPartnerships = prev.partnerships.map((partnership, i) => {
        if (i === partnershipIndex) {
          const updatedList = partnership[listField].map((item, j) => j === itemIndex ? value : item);
          return { ...partnership, [listField]: updatedList };
        }
        return partnership;
      });
      return { ...prev, partnerships: updatedPartnerships };
    });
  };

  const removeListItem = (partnershipIndex, listField, itemIndex) => {
    setFormData(prev => {
      const updatedPartnerships = prev.partnerships.map((partnership, i) => {
        if (i === partnershipIndex) {
          const updatedList = partnership[listField].filter((_, j) => j !== itemIndex);
          return { ...partnership, [listField]: updatedList };
        }
        return partnership;
      });
      return { ...prev, partnerships: updatedPartnerships };
    });
  };

  return {
    addPartnership,
    removePartnership,
    updatePartnership,
    addListItem,
    updateListItem,
    removeListItem
  };
};
