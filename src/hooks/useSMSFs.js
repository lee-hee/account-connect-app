export const useSMSFs = (formData, setFormData) => {
  const addSMSF = () => {
    setFormData(prev => ({
      ...prev,
      smsfs: [...prev.smsfs, {
        abn: '',
        gstRegistered: false,
        businessAddress: '',
        registeredAddress: '',
        tfn: '',
        tradingNames: [''],
        asicIndustryCodes: ['']
      }]
    }));
  };

  const removeSMSF = (index) => {
    setFormData(prev => ({
      ...prev,
      smsfs: prev.smsfs.filter((_, i) => i !== index)
    }));
  };

  const updateSMSF = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      smsfs: prev.smsfs.map((smsf, i) => 
        i === index ? { ...smsf, [field]: value } : smsf
      )
    }));
  };

  const addListItem = (index, listField) => {
    setFormData(prev => {
      const updatedSMSFs = prev.smsfs.map((smsf, i) => {
        if (i === index) {
          return { ...smsf, [listField]: [...smsf[listField], ''] };
        }
        return smsf;
      });
      return { ...prev, smsfs: updatedSMSFs };
    });
  };

  const updateListItem = (smsfIndex, listField, itemIndex, value) => {
    setFormData(prev => {
      const updatedSMSFs = prev.smsfs.map((smsf, i) => {
        if (i === smsfIndex) {
          const updatedList = smsf[listField].map((item, j) => j === itemIndex ? value : item);
          return { ...smsf, [listField]: updatedList };
        }
        return smsf;
      });
      return { ...prev, smsfs: updatedSMSFs };
    });
  };

  const removeListItem = (smsfIndex, listField, itemIndex) => {
    setFormData(prev => {
      const updatedSMSFs = prev.smsfs.map((smsf, i) => {
        if (i === smsfIndex) {
          const updatedList = smsf[listField].filter((_, j) => j !== itemIndex);
          return { ...smsf, [listField]: updatedList };
        }
        return smsf;
      });
      return { ...prev, smsfs: updatedSMSFs };
    });
  };

  return {
    addSMSF,
    removeSMSF,
    updateSMSF,
    addListItem,
    updateListItem,
    removeListItem
  };
};
