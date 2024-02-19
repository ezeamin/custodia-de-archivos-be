import { formatAddress } from './formatAddress.js';

export const formatBeneficiaryData = (beneficiaryData) => ({
  id: beneficiaryData.id_life_insurance_beneficiary,
  name: beneficiaryData.person.name,
  lastname: beneficiaryData.person.surname,
  dni: beneficiaryData.person.identification_number,
  gender: {
    id: beneficiaryData.person.gender.id_gender,
    description: beneficiaryData.person.gender.gender,
  },
  address: beneficiaryData.person.address
    ? formatAddress(beneficiaryData.person.address)
    : null,
  relationship: {
    id: beneficiaryData.family_relationship_type.id_family_relationship_type,
    description:
      beneficiaryData.family_relationship_type.family_relationship_type,
  },
  percentage: beneficiaryData.beneficiary_percentage,
});
