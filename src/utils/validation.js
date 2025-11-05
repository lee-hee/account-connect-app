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
    // Personal Details - Mandatory fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.contactNo.trim()) newErrors.contactNo = 'Contact number is required';

    // TFN validation
    if (!formData.tfn) newErrors.tfn = 'Tax File Number is required';
    else if (!validateTFN(formData.tfn)) newErrors.tfn = 'TFN must be 9 digits';

    // Middle Name is optional - no validation needed
  }

  if (step === 2) {
    // Financial Details - Bank Details are Mandatory
    if (!formData.bankName || !formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.accountName || !formData.accountName.trim()) newErrors.accountName = 'Account name is required';
    if (!formData.bsb || !formData.bsb.trim()) newErrors.bsb = 'BSB is required';
    else if (!/^\d{3}-?\d{3}$/.test(formData.bsb)) newErrors.bsb = 'BSB must be in format XXX-XXX';
    if (!formData.accountNumber || !formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';

    // Income Streams are optional - no validation needed
  }

  if (step === 3) {
    // Address & Residency
    if (!formData.residencyStatus) newErrors.residencyStatus = 'Residency status is required';
  }

  // Step 4 (Family Details) and Step 5 (Business Entities) have no mandatory validations

  if (step === 6) {
    // Agreements - Both must be checked
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the Terms of Service to continue';
    if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to the Privacy Policy to continue';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
