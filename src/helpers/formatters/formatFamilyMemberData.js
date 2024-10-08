import { formatPhone, uppercaseName } from '../helpers.js';

export const formatFamilyMemberData = (familyMemberData) => ({
  person: {
    identification_number: familyMemberData.cuil,
    name: uppercaseName(familyMemberData.name),
    surname: uppercaseName(familyMemberData.lastname),
    birth_date: familyMemberData.birthdate || undefined,
    id_gender: familyMemberData.genderId,
  },
  phone: {
    phone_no: formatPhone(familyMemberData.phone),
  },
  address: {
    street_number: familyMemberData.streetNumber || 0,
    door: familyMemberData.apt,
    observations: familyMemberData.addressObservations,
  },
  street: {
    street_api_id: familyMemberData.street.id,
    street: familyMemberData.street.description,
  },
  locality: {
    locality_api_id: familyMemberData.locality.id,
    locality: familyMemberData.locality.description,
  },
  province: {
    province_api_id: familyMemberData.state.id,
    province: familyMemberData.state.description,
  },
  id_relationship_type: familyMemberData.relationshipId,
});
