import { calculateDateDiffInAges } from '../helpers.js';

export const formatEmployeeResponseData = ({ employee, family, user }) => ({
  id: employee.id_employee,
  dni: employee.person.identification_number,
  imgSrc: employee.picture_url,
  lastname: employee.person.surname,
  firstname: employee.person.name,
  birthdate: employee.person.birth_date,
  workingHours: employee.working_hours,
  civilStatus: employee.person.civil_status_type
    ? {
        id: employee.person.id_civil_status,
        description: employee.person.civil_status_type.civil_status_type,
      }
    : null,
  address: employee.person.address
    ? {
        street: {
          id: employee.person.address.street.street_api_id,
          description: employee.person.address.street.street,
        },
        locality: {
          id: employee.person.address.street.locality.locality_api_id,
          description: employee.person.address.street.locality.locality,
        },
        state: {
          id: employee.person.address.street.locality.province.province_api_id,
          description:
            employee.person.address.street.locality.province.province,
        },
        streetNumber: employee.person.address.street_number,
        apt: employee.person.address.door,
      }
    : null,
  phone: employee.person.phone ? employee.person.phone.phone_no : null,
  email: employee.email,
  gender: {
    id: employee.person.id_gender,
    description: employee.person.gender.gender,
  },
  startDate: employee.employment_date,
  endDate: employee.termination_date,
  driversLicenseDate: employee.drivers_license_expiration_date,
  user: user
    ? {
        id: user.id_user,
      }
    : null,
  age: calculateDateDiffInAges(employee.person.birth_date),
  antiquity: calculateDateDiffInAges(employee.employment_date),
  position: employee.position,
  familyMembers: family.map((member) => ({
    id: member.id_family_member,
    name: member.person.name,
    relationship: member.family_relationship_type.family_relationship_type,
  })),
  area: {
    id: employee.area.id_area,
    description: employee.area.area,
  },
  fileNumber: employee.no_file,
  status: {
    id: employee.id_status,
    description: employee.employee_status.status,
  },
});
