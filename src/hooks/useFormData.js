import { useState } from 'react';

export const useFormData = () => {
  const [formData, setFormData] = useState({
    clientId: null, // Add this field to store the client ID
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
    partnerships: []
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