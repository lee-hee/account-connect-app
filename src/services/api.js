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
          clientId: formData.clientId, // Include clientId
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
          clientId: formData.clientId, // Include clientId
          addressResidential: formData.addressResidential || null,
          addressPostal: formData.addressPostal || null,
          residencyStatus: formData.residencyStatus
        };
        break;

      case 4: // Family Details
        endpoint = `${API_BASE_URL}/clients/save-family-details`;
        stepData = {
          clientId: formData.clientId, // Include clientId
          noOfDependentChildren: parseInt(formData.noOfDependentChildren) || 0,
          spouseName: formData.spouseName || null,
          spouseDob: formData.spouseDob || null
        };
        break;

      case 5: // Business Entities
        endpoint = `${API_BASE_URL}/clients/save-business-entities`;
        stepData = {
          clientId: formData.clientId, // Include clientId
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
          }))
        };
        break;

      case 6: // Review - No save needed
        return { success: true, message: 'Review step - no save needed' };

      case 7: // Agreements
        endpoint = `${API_BASE_URL}/clients/save-agreements`;
        stepData = {
          clientId: formData.clientId, // Include clientId
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
      message: `Step ${step} data saved successfully`,
      clientId: data.clientId || data.id // Return clientId from response
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
    }]
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
 * @param {string} entityType - Type of entity (soleTrader, company, trust, smsf, partnership)
 * @param {Object} entityData - Entity data
 * @param {string} entityId - Optional entity ID for updates
 * @param {number} clientId - Client ID to associate the entity with
 * @returns {Promise<Object>} API response
 */
export const saveBusinessEntity = async (entityType, entityData, entityId = null, clientId = null) => {
  try {
    let endpoint = '';
    let payload = {};

    switch(entityType) {
      case 'soleTrader':
        endpoint = `${API_BASE_URL}/clients/business-entities/sole-trader`;
        payload = {
          clientId: clientId, // Include clientId
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
          clientId: clientId, // Include clientId
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
          clientId: clientId, // Include clientId
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
          clientId: clientId, // Include clientId
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
          clientId: clientId, // Include clientId
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

export const loginUser = async (email, password) => {
  try {
    console.log('🔐 Logging in user:', email);
    console.log('📍 API Endpoint:', `${API_BASE_URL}/auth/login`);

    const loginRequest = {
      email: email,
      password: password
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginRequest)
    });

    console.log('📥 Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Error Response:', errorData);

      // Extract error message from server response
      let errorMessage = 'Invalid email or password';

      if (errorData._embedded && errorData._embedded.errors && errorData._embedded.errors.length > 0) {
        const firstError = errorData._embedded.errors[0].message;
        const parts = firstError.split(':');
        if (parts.length >= 2) {
          errorMessage = parts.slice(1).join(':').trim();
        } else {
          errorMessage = firstError;
        }
      }
      else if (errorData.message) {
        errorMessage = errorData.message;
      }
      else if (errorData.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }

    const accountConnectUser = await response.json();
    console.log('✅ Login successful - Account Connect User:', accountConnectUser);
    console.log('📋 User Role:', accountConnectUser.userRole);
    console.log('📋 External ID:', accountConnectUser.externalId);

    return {
      success: true,
      data: accountConnectUser
    };

  } catch (error) {
    console.error('❌ Login error:', error);

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * ACCOUNTANT REGISTRATION API
 * Add these functions to your src/services/api.js file
 */

/**
 * Sample Accountant Registration Fat DTO
 * This represents the complete nested structure sent to the backend in a single request
 * All data from all 3 steps is sent at the final submission
 */
const SAMPLE_ACCOUNTANT_FAT_DTO = {
  // Step 1: Personal Details
  personalDetails: {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@accountingfirm.com.au",
    phone: "+61412345678"
  },

  // Step 2: Authentication
  authentication: {
    password: "SecurePass123!" // Will be hashed on backend
  },

  // Step 3: Tax Practitioner Registration Details
  taxPractitioner: {
    businessName: "Smith & Associates Accounting",
    registrationNumber: "12345678", // Tax Practitioner Board registration number
    businessAddress: {
      street: "123 Collins Street",
      city: "Melbourne",
      state: "VIC",
      postcode: "3000"
    }
  },

  // System metadata (auto-generated)
  metadata: {
    accountStatus: "PENDING_VERIFICATION",
    registrationSource: "WEB_SIGNUP",
    submittedAt: "2025-11-08T10:30:00Z"
  }
};

/**
 * Register a new accountant with improved error handling
 * Sends all registration data as a single accountantRegisterDTO at the final step
 * Properly extracts and returns error messages from server responses
 *
 * @param {Object} accountantData - Complete accountant registration data from all steps
 * @returns {Promise<Object>} API response with success status
 */
export const registerAccountant = async (accountantData) => {
  try {
    // Transform the form data into a properly nested accountantRegisterDTO structure
    // This DTO contains ALL information from all 3 steps
    const accountantRegisterDTO = {
      // Step 1: Personal Details
      personalDetails: {
        firstName: accountantData.firstName,
        lastName: accountantData.lastName,
        email: accountantData.email,
        phone: accountantData.phone
      },

      // Step 2: Authentication
      authentication: {
        password: accountantData.password // Will be hashed on the backend
      },

      // Step 3: Tax Practitioner Registration
      taxPractitioner: {
        businessName: accountantData.businessName,
        registrationNumber: accountantData.registrationNumber,
        businessAddress: {
          street: accountantData.businessAddress,
          city: accountantData.city,
          state: accountantData.state,
          postcode: accountantData.postcode,
          country: "Australia"
        }
      },

      // System metadata
      metadata: {
        accountType: "ACCOUNTANT",
        accountStatus: "PENDING_VERIFICATION",
        registrationSource: "WEB_SIGNUP",
        submittedAt: new Date().toISOString()
      }
    };

    // Log the DTO structure (without sensitive data)
    console.log('🚀 Sending accountantRegisterDTO to accountant registration endpoint');
    console.log('📦 DTO Structure:', {
      ...accountantRegisterDTO,
      authentication: { password: '***HIDDEN***' } // Don't log actual password
    });
    console.log('📍 API Endpoint:', `${API_BASE_URL}/accountant/register`);

    const response = await fetch(`${API_BASE_URL}/accountant/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(accountantRegisterDTO)
    });

    console.log('📥 Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Error Response:', errorData);

      // Extract error message from server response
      let errorMessage = 'Registration failed. Please try again.';

      // Check for embedded errors format (Micronaut validation errors)
      if (errorData._embedded && errorData._embedded.errors && errorData._embedded.errors.length > 0) {
        const firstError = errorData._embedded.errors[0].message;
        // Extract message after second colon if it exists
        // Format: "request.personalDetails.phone: Phone must be a valid Australian number (+61 followed by 9 digits)"
        const parts = firstError.split(':');
        if (parts.length >= 2) {
          errorMessage = parts.slice(1).join(':').trim();
        } else {
          errorMessage = firstError;
        }
      }
      // Check for direct message
      else if (errorData.message && errorData.message !== 'Bad Request') {
        errorMessage = errorData.message;
      }
      // Check for error field
      else if (errorData.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Accountant registration successful:', data);

    return {
      success: true,
      data: data,
      message: 'Accountant registration submitted successfully. Your application will be reviewed by our team.'
    };

  } catch (error) {
    console.error('❌ Accountant registration error:', error);

    return {
      success: false,
      error: error.message,
      message: error.message || 'Failed to submit accountant registration. Please try again.'
    };
  }
};


/**
 * CLIENT PROVISIONING API FUNCTION
 * Add this function to your src/services/api.js file
 *
 * This function allows accountants to provision new clients with minimal information.
 * A secure random password is automatically generated on the backend.
 */

/**
 * Provision a new client (used by accountants to invite clients)
 * Creates a client account with minimal information and generates a secure password
 *
 * @param {Object} clientData - Client provisioning data
 * @param {string} clientData.firstName - Client's first name
 * @param {string} clientData.lastName - Client's last name
 * @param {string} clientData.email - Client's email address
 * @returns {Promise<Object>} API response with provisioned client data
 */
export const provisionClient = async (clientData) => {
  try {
    console.log('👤 Provisioning new client:', clientData.email);
    console.log('📍 API Endpoint:', `${API_BASE_URL}/clients/provision`);

    // Validate required fields
    if (!clientData.firstName || !clientData.lastName || !clientData.email) {
      throw new Error('First name, last name, and email are required');
    }

    const payload = {
      firstName: clientData.firstName.trim(),
      lastName: clientData.lastName.trim(),
      email: clientData.email.trim()
    };

    console.log('📦 Payload:', payload);

    const response = await fetch(`${API_BASE_URL}/clients/provision`, {
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
      console.log('❌ Error Response:', errorData);

      // Extract error message from server response
      let errorMessage = 'Failed to provision client';

      // Check for embedded errors format (Micronaut validation errors)
      if (errorData._embedded && errorData._embedded.errors && errorData._embedded.errors.length > 0) {
        const firstError = errorData._embedded.errors[0].message;
        const parts = firstError.split(':');
        if (parts.length >= 2) {
          errorMessage = parts.slice(1).join(':').trim();
        } else {
          errorMessage = firstError;
        }
      }
      // Check for direct message
      else if (errorData.message && errorData.message !== 'Bad Request') {
        errorMessage = errorData.message;
      }
      // Check for error field
      else if (errorData.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Client provisioned successfully:', data);

    return {
      success: true,
      data: data,
      message: 'Client provisioned successfully. A secure password has been generated and sent to their email.'
    };

  } catch (error) {
    console.error('❌ Client provisioning error:', error);

    return {
      success: false,
      error: error.message,
      message: error.message || 'Failed to provision client. Please try again.'
    };
  }
};


// Export all functions as default
export default {
  loginUser,
  provisionClient,
  saveStepData,
  registerClient,
  getClientById,
  updateClient,
  deleteClient,
  getAllClients,
  generateDummyClientData,
  saveBusinessEntity,
  deleteBusinessEntity,
  registerAccountant
};