export const useSoleTrader = (formData, setFormData) => {
  const addSoleTrader = () => {
    setFormData(prev => ({
      ...prev,
      soleTrader: {
        abn: '',
        gstRegistered: false,
        tradingNames: [''],
        businessAddress: '',
        registeredAddress: ''
      }
    }));
  };

  const removeSoleTrader = () => {
    setFormData(prev => ({ ...prev, soleTrader: null }));
  };

  const updateSoleTrader = (field, value) => {
    setFormData(prev => ({
      ...prev,
      soleTrader: { ...prev.soleTrader, [field]: value }
    }));
  };

  const addTradingName = () => {
    setFormData(prev => ({
      ...prev,
      soleTrader: {
        ...prev.soleTrader,
        tradingNames: [...prev.soleTrader.tradingNames, '']
      }
    }));
  };

  const updateTradingName = (index, value) => {
    setFormData(prev => ({
      ...prev,
      soleTrader: {
        ...prev.soleTrader,
        tradingNames: prev.soleTrader.tradingNames.map((name, i) => i === index ? value : name)
      }
    }));
  };

  const removeTradingName = (index) => {
    setFormData(prev => ({
      ...prev,
      soleTrader: {
        ...prev.soleTrader,
        tradingNames: prev.soleTrader.tradingNames.filter((_, i) => i !== index)
      }
    }));
  };

  return {
    addSoleTrader,
    removeSoleTrader,
    updateSoleTrader,
    addTradingName,
    updateTradingName,
    removeTradingName
  };
};
