export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateTFN = (tfn) => {
  return /^\d{9}$/.test(tfn);
};

export const validateABN = (abn) => {
  return /^\d{11}$/.test(abn);
};

export const validateACN = (acn) => {
  return /^\d{9}$/.test(acn);
};

export const validateStep = (step, formData, setErrors) => {
  const newErrors = {};
  
  if (step === 1) {
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.tfn && !validateTFN(formData.tfn)) newErrors.tfn = 'TFN must be 9 digits';
  }
  
  if (step === 2) {
    if (!formData.residencyStatus) newErrors.residencyStatus = 'Residency status is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
