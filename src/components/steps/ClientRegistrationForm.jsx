const handleNext = async () => {
  // Validate current step
  if (!validateStep(currentStep, formData, setErrors)) {
    return; // Don't proceed if validation fails
  }

  // Skip saving for step 5 (Business Entities) - entities are saved individually
  if (currentStep === 5) {
    // Just move to next step without saving
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
    return;
  }

  // Save current step data to backend
  setIsSaving(true);
  setSaveStatus('saving');

  const saveResult = await saveStepData(formData, currentStep);

  if (saveResult.success) {
    setSaveStatus('saved');
    console.log(`✅ Step ${currentStep} data saved successfully`);

    // If this is step 1 (Personal Info), store the clientId
    if (currentStep === 1 && saveResult.clientId) {
      console.log(`📝 Client ID received: ${saveResult.clientId}`);
      setFormData(prev => ({
        ...prev,
        clientId: saveResult.clientId
      }));
    }

    // Clear save status after 2 seconds
    setTimeout(() => setSaveStatus(null), 2000);

    // Move to next step
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  } else {
    setSaveStatus('error');
    console.error('❌ Save failed:', saveResult.error);

    // Show error for 3 seconds
    setTimeout(() => setSaveStatus(null), 3000);

    // For step 1, don't proceed if save failed (we need the clientId)
    if (currentStep === 1) {
      alert('Failed to save personal information. Please try again.');
      setIsSaving(false);
      return;
    }

    // Still allow user to proceed for other steps (optional - you can block here if needed)
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  }

  setIsSaving(false);
};