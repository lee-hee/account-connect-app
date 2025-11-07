/**
 * API Service for Account Connect
 * Handles all backend API communications
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Transform form data to match backend DTO structure
 * Converts frontend form data to the format expected by the Micronaut backend
 * 
 * @param {Object} formData - Frontend form data
 * @returns {Object} Transformed DTO for backend
 */
const transformFormDataToDTO = (formData) => {
  return {
    // Client Basic Information
    firstName: formData.firstName,
    middleName: formData.middleName || null,
    lastName: formData.lastName,
    dob: formData.dob || null,
    tfn: formData.tfn ? parseInt(formData.tfn) : null,
    email: formData.email,
    contactNo: formData.contactNo || null,
    
    // Address Information
    addressResidential: formData.addressResidential || null,
    addressPostal: formData.addressPostal || null,
    residencyStatus: formData.residencyStatus,
    
    // Family Information
    noOfDependentChildren: parseInt(formData.noOfDependentChildren) || 0,
    spouseName: formData.spouseName || null,
    spouseDob: formData.spouseDob || null,

    // Primary Bank Details
    bankName: formData.bankName || null,
    accountName: formData.accountName || null,
    bsb: formData.bsb || null,
    accountNumber: formData.accountNumber || null,
    accountType: formData.accountType || null,
    
    // Agreements
    agreeToTerms: formData.agreeToTerms || false,
    agreeToPrivacy: formData.agreeToPrivacy || false,
    agreementsAcceptedDate: formData.agreeToTerms && formData.agreeToPrivacy ? new Date().toISOString() : null,
    
    // System Fields
    emailVerified: false,
    
    // Sole Trader (One-to-One relationship) with optional banking
    soleTrader: formData.soleTrader ? {
      abn: formData.soleTrader.abn ? parseInt(formData.soleTrader.abn) : null,
      gstRegistered: formData.soleTrader.gstRegistered || false,
      tradingName: formData.soleTrader.tradingNames?.filter(name => name.trim() !== '') || [],
      businessAddress: formData.soleTrader.businessAddress || null,
      registeredAddress: formData.soleTrader.registeredAddress || null,
      // Banking details for sole trader
      usePrimaryBanking: formData.soleTrader.usePrimaryBanking !== undefined ? formData.soleTrader.usePrimaryBanking : true,
      bankName: formData.soleTrader.bankName || null,
      accountName: formData.soleTrader.accountName || null,
      bsb: formData.soleTrader.bsb || null,
      accountNumber: formData.soleTrader.accountNumber || null
    } : null,
    
    // Companies (Many-to-Many relationship)
    companyList: (formData.companies || []).map(company => ({
      abn: company.abn ? parseInt(company.abn) : null,
      acn: company.acn ? parseInt(company.acn) : null,
      gstRegistered: company.gstRegistered || false,
      businessAddress: company.businessAddress || null,
      registeredAddress: company.registeredAddress || null,
      tfn: company.tfn ? parseInt(company.tfn) : null,
      tradingNames: company.tradingNames?.filter(name => name.trim() !== '') || [],
      asicIndustryCodes: company.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
      usePrimaryBanking: company.usePrimaryBanking !== undefined ? company.usePrimaryBanking : true,
      bankName: company.bankName || null,
      accountName: company.accountName || null,
      bsb: company.bsb || null,
      accountNumber: company.accountNumber || null
    })),
    
    // Trusts (Many-to-Many relationship)
    trustList: (formData.trusts || []).map(trust => ({
      abn: trust.abn ? parseInt(trust.abn) : null,
      gstRegistered: trust.gstRegistered || false,
      trustType: trust.trustType || null,
      businessAddress: trust.businessAddress || null,
      registeredAddress: trust.registeredAddress || null,
      tfn: trust.tfn ? parseInt(trust.tfn) : null,
      tradingNames: trust.tradingNames?.filter(name => name.trim() !== '') || [],
      asicIndustryCodes: trust.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
      usePrimaryBanking: trust.usePrimaryBanking !== undefined ? trust.usePrimaryBanking : true,
      bankName: trust.bankName || null,
      accountName: trust.accountName || null,
      bsb: trust.bsb || null,
      accountNumber: trust.accountNumber || null
    })),
    
    // SMSFs (Many-to-Many relationship)
    smsfList: (formData.smsfs || []).map(smsf => ({
      abn: smsf.abn ? parseInt(smsf.abn) : null,
      gstRegistered: smsf.gstRegistered || false,
      businessAddress: smsf.businessAddress || null,
      registeredAddress: smsf.registeredAddress || null,
      tfn: smsf.tfn ? parseInt(smsf.tfn) : null,
      tradingNames: smsf.tradingNames?.filter(name => name.trim() !== '') || [],
      asicIndustryCodes: smsf.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
      usePrimaryBanking: smsf.usePrimaryBanking !== undefined ? smsf.usePrimaryBanking : true,
      bankName: smsf.bankName || null,
      accountName: smsf.accountName || null,
      bsb: smsf.bsb || null,
      accountNumber: smsf.accountNumber || null
    })),
    
    // Partnerships (Many-to-Many relationship)
    partnerships: (formData.partnerships || []).map(partnership => ({
      abn: partnership.abn ? parseInt(partnership.abn) : null,
      gstRegistered: partnership.gstRegistered || false,
      businessAddress: partnership.businessAddress || null,
      tfn: partnership.tfn ? parseInt(partnership.tfn) : null,
      tradingNames: partnership.tradingNames?.filter(name => name.trim() !== '') || [],
      usePrimaryBanking: partnership.usePrimaryBanking !== undefined ? partnership.usePrimaryBanking : true,
      bankName: partnership.bankName || null,
      accountName: partnership.accountName || null,
      bsb: partnership.bsb || null,
      accountNumber: partnership.accountNumber || null
    })),
    
    // Investment Properties (Many-to-Many relationship)
    investmentProperties: (formData.investmentProperties || []).map(property => ({
      address: property.address,
      purchaseValue: property.purchaseValue ? parseFloat(property.purchaseValue) : null,
      mortgageLenderName: property.mortgageLenderName || null
    }))
  };
};

/**
 * Save current step data to backend using step-specific endpoints
 * Each step has its own meaningful endpoint name
 * 
 * @param {Object} formData - Complete form data
 * @param {number} step - Current step number
 * @returns {Promise<Object>} API response
 */
export const saveStepData = async (formData, step) => {
  try {
    let stepData = {};
    let endpoint = '';
    
    // Extract data and set endpoint based on current step
    switch(step) {
      case 1: // Personal Info
        endpoint = `${API_BASE_URL}/clients/save-personal-info`;
        stepData = {
          firstName: formData.firstName,
          middleName: formData.middleName || null,
          lastName: formData.lastName,
          dob: formData.dob || null,
          tfn: formData.tfn ? parseInt(formData.tfn) : null,
          email: formData.email,
          contactNo: formData.contactNo || null
        };
        break;
        
      case 2: // Financial Details / Income Streams
        endpoint = `${API_BASE_URL}/clients/save-income-stream-info`;
        stepData = {
          bankName: formData.bankName || null,
          accountName: formData.accountName || null,
          bsb: formData.bsb || null,
          accountNumber: formData.accountNumber || null,
          accountType: formData.accountType || null,
          hasCrypto: formData.hasCrypto || false,
          cryptoType: formData.cryptoType || null,
          hasInvestmentProperty: formData.hasInvestmentProperty || false,
          hasStocks: formData.hasStocks || false
        };
        break;
        
      case 3: // Address & Residency
        endpoint = `${API_BASE_URL}/clients/save-address-residency`;
        stepData = {
          addressResidential: formData.addressResidential || null,
          addressPostal: formData.addressPostal || null,
          residencyStatus: formData.residencyStatus
        };
        break;
        
      case 4: // Family Details
        endpoint = `${API_BASE_URL}/clients/save-family-details`;
        stepData = {
          noOfDependentChildren: parseInt(formData.noOfDependentChildren) || 0,
          spouseName: formData.spouseName || null,
          spouseDob: formData.spouseDob || null
        };
        break;
        
      case 5: // Business Entities
        endpoint = `${API_BASE_URL}/clients/save-business-entities`;
        stepData = {
          // Sole Trader
          soleTrader: formData.soleTrader ? {
            abn: formData.soleTrader.abn ? parseInt(formData.soleTrader.abn) : null,
            gstRegistered: formData.soleTrader.gstRegistered || false,
            tradingName: formData.soleTrader.tradingNames?.filter(name => name.trim() !== '') || [],
            businessAddress: formData.soleTrader.businessAddress || null,
            registeredAddress: formData.soleTrader.registeredAddress || null,
            usePrimaryBanking: formData.soleTrader.usePrimaryBanking !== undefined ? formData.soleTrader.usePrimaryBanking : true,
            bankName: formData.soleTrader.bankName || null,
            accountName: formData.soleTrader.accountName || null,
            bsb: formData.soleTrader.bsb || null,
            accountNumber: formData.soleTrader.accountNumber || null
          } : null,
          
          // Companies
          companyList: (formData.companies || []).map(company => ({
            abn: company.abn ? parseInt(company.abn) : null,
            acn: company.acn ? parseInt(company.acn) : null,
            gstRegistered: company.gstRegistered || false,
            businessAddress: company.businessAddress || null,
            registeredAddress: company.registeredAddress || null,
            tfn: company.tfn ? parseInt(company.tfn) : null,
            tradingNames: company.tradingNames?.filter(name => name.trim() !== '') || [],
            asicIndustryCodes: company.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
            usePrimaryBanking: company.usePrimaryBanking !== undefined ? company.usePrimaryBanking : true,
            bankName: company.bankName || null,
            accountName: company.accountName || null,
            bsb: company.bsb || null,
            accountNumber: company.accountNumber || null
          })),
          
          // Trusts
          trustList: (formData.trusts || []).map(trust => ({
            abn: trust.abn ? parseInt(trust.abn) : null,
            gstRegistered: trust.gstRegistered || false,
            trustType: trust.trustType || null,
            businessAddress: trust.businessAddress || null,
            registeredAddress: trust.registeredAddress || null,
            tfn: trust.tfn ? parseInt(trust.tfn) : null,
            tradingNames: trust.tradingNames?.filter(name => name.trim() !== '') || [],
            asicIndustryCodes: trust.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
            usePrimaryBanking: trust.usePrimaryBanking !== undefined ? trust.usePrimaryBanking : true,
            bankName: trust.bankName || null,
            accountName: trust.accountName || null,
            bsb: trust.bsb || null,
            accountNumber: trust.accountNumber || null
          })),
          
          // SMSFs
          smsfList: (formData.smsfs || []).map(smsf => ({
            abn: smsf.abn ? parseInt(smsf.abn) : null,
            gstRegistered: smsf.gstRegistered || false,
            businessAddress: smsf.businessAddress || null,
            registeredAddress: smsf.registeredAddress || null,
            tfn: smsf.tfn ? parseInt(smsf.tfn) : null,
            tradingNames: smsf.tradingNames?.filter(name => name.trim() !== '') || [],
            asicIndustryCodes: smsf.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
            usePrimaryBanking: smsf.usePrimaryBanking !== undefined ? smsf.usePrimaryBanking : true,
            bankName: smsf.bankName || null,
            accountName: smsf.accountName || null,
            bsb: smsf.bsb || null,
            accountNumber: smsf.accountNumber || null
          })),
          
          // Partnerships
          partnerships: (formData.partnerships || []).map(partnership => ({
            abn: partnership.abn ? parseInt(partnership.abn) : null,
            gstRegistered: partnership.gstRegistered || false,
            businessAddress: partnership.businessAddress || null,
            tfn: partnership.tfn ? parseInt(partnership.tfn) : null,
            tradingNames: partnership.tradingNames?.filter(name => name.trim() !== '') || [],
            usePrimaryBanking: partnership.usePrimaryBanking !== undefined ? partnership.usePrimaryBanking : true,
            bankName: partnership.bankName || null,
            accountName: partnership.accountName || null,
            bsb: partnership.bsb || null,
            accountNumber: partnership.accountNumber || null
          })),
          
          // Investment Properties
          investmentProperties: (formData.investmentProperties || []).map(property => ({
            address: property.address,
            purchaseValue: property.purchaseValue ? parseFloat(property.purchaseValue) : null,
            mortgageLenderName: property.mortgageLenderName || null
          }))
        };
        break;
        
      case 6: // Review - No save needed
        return { success: true, message: 'Review step - no save needed' };
        
      case 7: // Agreements
        endpoint = `${API_BASE_URL}/clients/save-agreements`;
        stepData = {
          agreeToTerms: formData.agreeToTerms || false,
          agreeToPrivacy: formData.agreeToPrivacy || false,
          agreementsAcceptedDate: formData.agreeToTerms && formData.agreeToPrivacy ? new Date().toISOString() : null
        };
        break;
        
      default:
        throw new Error(`Invalid step number: ${step}`);
    }

    console.log(`📤 Sending Step ${step} data to backend`);
    console.log(`📍 Endpoint: ${endpoint}`);
    console.log(`📦 Payload:`, stepData);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(stepData)
    });

    console.log('📥 Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Step data saved successfully:', data);
    
    return {
      success: true,
      data: data,
      message: `Step ${step} data saved successfully`
    };

  } catch (error) {
    console.error('❌ Save error:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to save data'
    };
  }
};

/**
 * Generate dummy client data for testing
 * Creates a complete client object with sample data
 * 
 * @returns {Object} Dummy client data
 */
export const generateDummyClientData = () => {
  return {
    // Personal Information
    firstName: "John",
    middleName: "William",
    lastName: "Smith",
    dob: "1985-06-15",
    tfn: "123456789",
    email: "john.smith@example.com",
    contactNo: "+61412345678",
    
    // Address Information
    addressResidential: "123 Main Street, Melbourne VIC 3000",
    addressPostal: "PO Box 456, Melbourne VIC 3001",
    residencyStatus: "CITIZEN",
    
    // Family Information
    noOfDependentChildren: 2,
    spouseName: "Jane Smith",
    spouseDob: "1987-08-20",
    
    // Primary Banking
    bankName: "Commonwealth Bank",
    accountName: "John Smith",
    bsb: "063-123",
    accountNumber: "12345678",
    
    // Agreements
    agreeToTerms: true,
    agreeToPrivacy: true,
    
    // Sole Trader with separate banking
    soleTrader: {
      abn: "12345678901",
      gstRegistered: true,
      tradingNames: ["John's Consulting", "JS Services"],
      businessAddress: "456 Business Ave, Melbourne VIC 3000",
      registeredAddress: "123 Main Street, Melbourne VIC 3000",
      usePrimaryBanking: false,
      bankName: "Westpac",
      accountName: "John's Consulting",
      bsb: "032-456",
      accountNumber: "98765432"
    },
    
    // Companies
    companies: [{
      abn: "98765432101",
      acn: "123456789",
      gstRegistered: true,
      businessAddress: "789 Corporate Blvd, Melbourne VIC 3000",
      registeredAddress: "789 Corporate Blvd, Melbourne VIC 3000",
      tfn: "987654321",
      tradingNames: ["Tech Solutions Pty Ltd", "TS Digital"],
      asicIndustryCodes: ["6201", "6202"]
    }],
    
    // Trusts
    trusts: [{
      abn: "11223344556",
      gstRegistered: false,
      trustType: "DISCRETIONARY",
      businessAddress: "321 Trust Lane, Melbourne VIC 3000",
      registeredAddress: "321 Trust Lane, Melbourne VIC 3000",
      tfn: "112233445",
      tradingNames: ["Smith Family Trust"],
      asicIndustryCodes: ["6420"]
    }],
    
    // SMSFs
    smsfs: [{
      abn: "55667788990",
      gstRegistered: false,
      businessAddress: "999 Retirement Rd, Melbourne VIC 3000",
      registeredAddress: "999 Retirement Rd, Melbourne VIC 3000",
      tfn: "556677889",
      tradingNames: ["Smith Super Fund"],
      asicIndustryCodes: ["6330"]
    }],
    
    // Partnerships
    partnerships: [{
      abn: "44556677889",
      gstRegistered: true,
      businessAddress: "777 Partnership Plaza, Melbourne VIC 3000",
      tfn: "445566778",
      tradingNames: ["Smith & Associates"]
    }],
    
    // Investment Properties
    investmentProperties: [
      {
        address: "45 Investment Street, Sydney NSW 2000",
        purchaseValue: "850000",
        mortgageLenderName: "Commonwealth Bank"
      },
      {
        address: "12 Rental Avenue, Brisbane QLD 4000",
        purchaseValue: "650000",
        mortgageLenderName: "Westpac"
      }
    ]
  };
};

/**
 * Register a new client (final submission)
 * Sends complete client data to the backend API
 * 
 * @param {Object} formData - Client form data
 * @returns {Promise<Object>} API response with success status and data/error
 */
export const registerClient = async (formData) => {
  try {
    const payload = transformFormDataToDTO(formData);
    
    console.log('🚀 Sending final registration data to API:', payload);
    console.log('📍 API Endpoint:', `${API_BASE_URL}/clients/register`);

    const response = await fetch(`${API_BASE_URL}/clients/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Registration successful:', data);
    
    return {
      success: true,
      data: data,
      message: 'Client registered successfully'
    };

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to register client. Please check your backend server.'
    };
  }
};

/**
 * Get client by ID
 * Retrieves a client's information from the backend
 * 
 * @param {number} clientId - The client's ID
 * @returns {Promise<Object>} API response with client data
 */
export const getClientById = async (clientId) => {
  try {
    console.log(`🔍 Fetching client with ID: ${clientId}`);
    
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Client data retrieved:', data);
    
    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('❌ Fetch client error:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update client information
 * Updates an existing client's data
 * 
 * @param {number} clientId - The client's ID
 * @param {Object} formData - Updated client data
 * @returns {Promise<Object>} API response with updated data
 */
export const updateClient = async (clientId, formData) => {
  try {
    const payload = transformFormDataToDTO(formData);
    
    console.log(`🔄 Updating client ${clientId}:`, payload);

    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Client updated successfully:', data);
    
    return {
      success: true,
      data: data,
      message: 'Client updated successfully'
    };

  } catch (error) {
    console.error('❌ Update error:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to update client'
    };
  }
};

/**
 * Delete client
 * Removes a client from the system
 * 
 * @param {number} clientId - The client's ID
 * @returns {Promise<Object>} API response confirming deletion
 */
export const deleteClient = async (clientId) => {
  try {
    console.log(`🗑️ Deleting client ${clientId}`);

    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Client deleted successfully');
    
    return {
      success: true,
      message: 'Client deleted successfully'
    };

  } catch (error) {
    console.error('❌ Delete error:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete client'
    };
  }
};

/**
 * Get all clients
 * Retrieves a list of all clients
 * 
 * @returns {Promise<Object>} API response with list of clients
 */
export const getAllClients = async () => {
  try {
    console.log('📋 Fetching all clients');

    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Retrieved ${data.length} clients`);
    
    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('❌ Fetch all clients error:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Save individual business entity
 * 
 * @param {string} entityType - Type of entity (soleTrader, company, trust, smsf, partnership, property)
 * @param {Object} entityData - Entity data
 * @param {string} entityId - Optional entity ID for updates
 * @returns {Promise<Object>} API response
 */
export const saveBusinessEntity = async (entityType, entityData, entityId = null) => {
  try {
    let endpoint = '';
    let payload = {};
    
    switch(entityType) {
      case 'soleTrader':
        endpoint = `${API_BASE_URL}/clients/business-entities/sole-trader`;
        payload = {
          abn: entityData.abn ? parseInt(entityData.abn) : null,
          gstRegistered: entityData.gstRegistered || false,
          tradingName: entityData.tradingNames?.filter(name => name.trim() !== '') || [],
          businessAddress: entityData.businessAddress || null,
          registeredAddress: entityData.registeredAddress || null,
          usePrimaryBanking: entityData.usePrimaryBanking !== undefined ? entityData.usePrimaryBanking : true,
          bankName: entityData.bankName || null,
          accountName: entityData.accountName || null,
          bsb: entityData.bsb || null,
          accountNumber: entityData.accountNumber || null
        };
        break;
        
      case 'company':
        endpoint = `${API_BASE_URL}/clients/business-entities/company`;
        payload = {
          id: entityId,
          abn: entityData.abn ? parseInt(entityData.abn) : null,
          acn: entityData.acn ? parseInt(entityData.acn) : null,
          gstRegistered: entityData.gstRegistered || false,
          businessAddress: entityData.businessAddress || null,
          registeredAddress: entityData.registeredAddress || null,
          tfn: entityData.tfn ? parseInt(entityData.tfn) : null,
          tradingNames: entityData.tradingNames?.filter(name => name.trim() !== '') || [],
          asicIndustryCodes: entityData.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
          usePrimaryBanking: entityData.usePrimaryBanking !== undefined ? entityData.usePrimaryBanking : true,
          bankName: entityData.bankName || null,
          accountName: entityData.accountName || null,
          bsb: entityData.bsb || null,
          accountNumber: entityData.accountNumber || null
        };
        break;
        
      case 'trust':
        endpoint = `${API_BASE_URL}/clients/business-entities/trust`;
        payload = {
          id: entityId,
          abn: entityData.abn ? parseInt(entityData.abn) : null,
          gstRegistered: entityData.gstRegistered || false,
          trustType: entityData.trustType || null,
          businessAddress: entityData.businessAddress || null,
          registeredAddress: entityData.registeredAddress || null,
          tfn: entityData.tfn ? parseInt(entityData.tfn) : null,
          tradingNames: entityData.tradingNames?.filter(name => name.trim() !== '') || [],
          asicIndustryCodes: entityData.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
          usePrimaryBanking: entityData.usePrimaryBanking !== undefined ? entityData.usePrimaryBanking : true,
          bankName: entityData.bankName || null,
          accountName: entityData.accountName || null,
          bsb: entityData.bsb || null,
          accountNumber: entityData.accountNumber || null
        };
        break;
        
      case 'smsf':
        endpoint = `${API_BASE_URL}/clients/business-entities/smsf`;
        payload = {
          id: entityId,
          abn: entityData.abn ? parseInt(entityData.abn) : null,
          gstRegistered: entityData.gstRegistered || false,
          businessAddress: entityData.businessAddress || null,
          registeredAddress: entityData.registeredAddress || null,
          tfn: entityData.tfn ? parseInt(entityData.tfn) : null,
          tradingNames: entityData.tradingNames?.filter(name => name.trim() !== '') || [],
          asicIndustryCodes: entityData.asicIndustryCodes?.filter(code => code.trim() !== '') || [],
          usePrimaryBanking: entityData.usePrimaryBanking !== undefined ? entityData.usePrimaryBanking : true,
          bankName: entityData.bankName || null,
          accountName: entityData.accountName || null,
          bsb: entityData.bsb || null,
          accountNumber: entityData.accountNumber || null
        };
        break;
        
      case 'partnership':
        endpoint = `${API_BASE_URL}/clients/business-entities/partnership`;
        payload = {
          id: entityId,
          abn: entityData.abn ? parseInt(entityData.abn) : null,
          gstRegistered: entityData.gstRegistered || false,
          businessAddress: entityData.businessAddress || null,
          tfn: entityData.tfn ? parseInt(entityData.tfn) : null,
          tradingNames: entityData.tradingNames?.filter(name => name.trim() !== '') || [],
          usePrimaryBanking: entityData.usePrimaryBanking !== undefined ? entityData.usePrimaryBanking : true,
          bankName: entityData.bankName || null,
          accountName: entityData.accountName || null,
          bsb: entityData.bsb || null,
          accountNumber: entityData.accountNumber || null
        };
        break;
        
      case 'property':
        endpoint = `${API_BASE_URL}/clients/business-entities/investment-property`;
        payload = {
          id: entityId,
          address: entityData.address,
          purchaseValue: entityData.purchaseValue ? parseFloat(entityData.purchaseValue) : null,
          mortgageLenderName: entityData.mortgageLenderName || null
        };
        break;
        
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }

    console.log(`💾 Saving ${entityType}:`, payload);
    console.log(`📍 Endpoint: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ ${entityType} saved successfully:`, data);
    
    return {
      success: true,
      data: data,
      message: `${entityType} saved successfully`
    };

  } catch (error) {
    console.error(`❌ Error saving ${entityType}:`, error);
    
    return {
      success: false,
      error: error.message,
      message: `Failed to save ${entityType}`
    };
  }
};

/**
 * Delete individual business entity
 * 
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID to delete
 * @returns {Promise<Object>} API response
 */
export const deleteBusinessEntity = async (entityType, entityId) => {
  try {
    let endpoint = '';
    
    switch(entityType) {
      case 'soleTrader':
        endpoint = `${API_BASE_URL}/clients/business-entities/sole-trader`;
        break;
      case 'company':
        endpoint = `${API_BASE_URL}/clients/business-entities/company/${entityId}`;
        break;
      case 'trust':
        endpoint = `${API_BASE_URL}/clients/business-entities/trust/${entityId}`;
        break;
      case 'smsf':
        endpoint = `${API_BASE_URL}/clients/business-entities/smsf/${entityId}`;
        break;
      case 'partnership':
        endpoint = `${API_BASE_URL}/clients/business-entities/partnership/${entityId}`;
        break;
      case 'property':
        endpoint = `${API_BASE_URL}/clients/business-entities/investment-property/${entityId}`;
        break;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }

    console.log(`🗑️ Deleting ${entityType} with ID: ${entityId}`);
    console.log(`📍 Endpoint: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    console.log(`✅ ${entityType} deleted successfully`);
    
    return {
      success: true,
      message: `${entityType} deleted successfully`
    };

  } catch (error) {
    console.error(`❌ Error deleting ${entityType}:`, error);
    
    return {
      success: false,
      error: error.message,
      message: `Failed to delete ${entityType}`
    };
  }
};

// Export all functions as default
export default {
  saveStepData,
  registerClient,
  getClientById,
  updateClient,
  deleteClient,
  getAllClients,
  generateDummyClientData,
  saveBusinessEntity,
  deleteBusinessEntity
};
