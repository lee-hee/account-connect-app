export const useInvestmentProperties = (formData, setFormData) => {
  const addProperty = () => {
    setFormData(prev => ({
      ...prev,
      investmentProperties: [...prev.investmentProperties, {
        address: '',
        purchaseValue: '',
        mortgageLenderName: ''
      }]
    }));
  };

  const removeProperty = (index) => {
    setFormData(prev => ({
      ...prev,
      investmentProperties: prev.investmentProperties.filter((_, i) => i !== index)
    }));
  };

  const updateProperty = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      investmentProperties: prev.investmentProperties.map((property, i) => 
        i === index ? { ...property, [field]: value } : property
      )
    }));
  };

  return {
    addProperty,
    removeProperty,
    updateProperty
  };
};
