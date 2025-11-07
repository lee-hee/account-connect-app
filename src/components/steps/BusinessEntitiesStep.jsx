import React from 'react';
import { useSoleTrader } from '../../hooks/useSoleTrader';
import { useCompanies } from '../../hooks/useCompanies';
import { useTrusts } from '../../hooks/useTrusts';
import { useSMSFs } from '../../hooks/useSMSFs';
import { usePartnerships } from '../../hooks/usePartnerships';
import SoleTraderEntity from '../entities/SoleTraderEntity';
import CompanyEntity from '../entities/CompanyEntity';
import TrustEntity from '../entities/TrustEntity';
import SMSFEntity from '../entities/SMSFEntity';
import PartnershipEntity from '../entities/PartnershipEntity';


const BusinessEntitiesStep = ({ formData, setFormData }) => {
  const soleTraderHandlers = useSoleTrader(formData, setFormData);
  const companyHandlers = useCompanies(formData, setFormData);
  const trustHandlers = useTrusts(formData, setFormData);
  const smsfHandlers = useSMSFs(formData, setFormData);
  const partnershipHandlers = usePartnerships(formData, setFormData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Business Entities & Investments</h2>
      
      <SoleTraderEntity 
        soleTrader={formData.soleTrader}
        handlers={soleTraderHandlers}
        formData={formData}
      />
      
      <CompanyEntity 
        companies={formData.companies}
        handlers={companyHandlers}
        formData={formData}
      />
      
      <TrustEntity 
        trusts={formData.trusts}
        handlers={trustHandlers}
        formData={formData}
      />
      
      <SMSFEntity 
        smsfs={formData.smsfs}
        handlers={smsfHandlers}
        formData={formData}
      />
      
      <PartnershipEntity 
        partnerships={formData.partnerships}
        handlers={partnershipHandlers}
        formData={formData}
      />

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All business entities support banking details selection. 
          You can use your primary banking or add separate banking for each entity.
        </p>
      </div>
    </div>
  );
};

export default BusinessEntitiesStep;
