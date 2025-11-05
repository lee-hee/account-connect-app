import { useState } from 'react';

export const useFormData = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    tfn: '',
    email: '',
    contactNo: '',
    addressResidential: '',
    addressPostal: '',
    residencyStatus: '',
    noOfDependentChildren: 0,
    spouseName: '',
    spouseDob: '',
    bankName: '',
    accountName: '',
    bsb: '',
    accountNumber: '',
    accountType: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    soleTrader: null,
    companies: [],
    trusts: [],
    smsfs: [],
    partnerships: [],
    investmentProperties: []
  });

  const handleInputChange = (e, setErrors) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (setErrors) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return { formData, setFormData, handleInputChange };
};
