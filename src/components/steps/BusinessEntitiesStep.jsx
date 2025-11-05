import React from 'react';
import { useSoleTrader } from '../../hooks/useSoleTrader';
import { useCompanies } from '../../hooks/useCompanies';
import { useTrusts } from '../../hooks/useTrusts';
import { useSMSFs } from '../../hooks/useSMSFs';
import { usePartnerships } from '../../hooks/usePartnerships';
import { useInvestmentProperties } from '../../hooks/useInvestmentProperties';
import SoleTraderEntity from '../entities/SoleTraderEntity';
import CompanyEntity from '../entities/CompanyEntity';
import TrustEntity from '../entities/TrustEntity';
import SMSFEntity from '../entities/SMSFEntity';
import PartnershipEntity from '../entities/PartnershipEntity';
import InvestmentPropertyEntity from '../entities/InvestmentPropertyEntity';

const BusinessEntitiesStep = ({ formData, setFormData }) => {
  const soleTraderHandlers = useSoleTrader(formData, setFormData);
  const companyHandlers = useCompanies(formData, setFormData);
  const trustHandlers = useTrusts(formData, setFormData);
  const smsfHandlers = useSMSFs(formData, setFormData);
  const partnershipHandlers = usePartnerships(formData, setFormData);
  const propertyHandlers = useInvestmentProperties(formData, setFormData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Business Entities & Investments</h2>
      
      <SoleTraderEntity 
        soleTrader={formData.soleTrader}
        handlers={soleTraderHandlers}
      />
      
      <CompanyEntity 
        companies={formData.companies}
        handlers={companyHandlers}
      />
      
      <TrustEntity 
        trusts={formData.trusts}
        handlers={trustHandlers}
      />
      
      <SMSFEntity 
        smsfs={formData.smsfs}
        handlers={smsfHandlers}
      />
      
      <PartnershipEntity 
        partnerships={formData.partnerships}
        handlers={partnershipHandlers}
      />
      
      <InvestmentPropertyEntity 
        properties={formData.investmentProperties}
        handlers={propertyHandlers}
      />

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All business entity types are now fully modular. 
          Each entity component is in a separate file for easy maintenance.
        </p>
      </div>
    </div>
  );
};

export default BusinessEntitiesStep;
