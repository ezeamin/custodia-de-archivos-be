import { uppercaseName } from '../helpers.js';

export const formatEmployeeData = (originalData) => {
  const newData = {
    employee: {
      id_status: originalData.statusId,
      id_area: originalData.areaId,
      email: originalData.email,
      position: originalData.position,
      employment_date: originalData.startDate,
      termination_date: originalData.endDate,
      no_file: originalData.fileNumber,
      working_hours: originalData.workingHours,
    },
    person: {
      id_gender: originalData.genderId,
      id_civil_status: originalData.civilStatusId,
      name: uppercaseName(originalData.name),
      surname: uppercaseName(originalData.lastname),
      birth_date: originalData.birthdate,
      identification_number: originalData.dni,
    },
    address: {
      street_number: originalData.streetNumber,
      door: originalData.apt,
    },
    phone: {
      phone_no: originalData.phone,
    },
    ...(originalData.street
      ? {
          street: {
            street_api_id: originalData.street.id,
            street: originalData.street.description,
          },
        }
      : {}),
    ...(originalData.locality
      ? {
          locality: {
            locality_api_id: originalData.locality.id,
            locality: originalData.locality.description,
          },
        }
      : {}),
    ...(originalData.state
      ? {
          province: {
            province_api_id: originalData.state.id,
            province: originalData.state.description,
          },
        }
      : {}),
  };

  // remove all undefined values
  Object.keys(newData).forEach((key) => {
    if (newData[key] && typeof newData[key] === 'object') {
      Object.keys(newData[key]).forEach((subKey) => {
        if (newData[key][subKey] === undefined) {
          delete newData[key][subKey];
        }
      });
    } else if (newData[key] === undefined) {
      delete newData[key];
    }
  });

  // remove empty objects
  Object.keys(newData).forEach((key) => {
    if (newData[key] && typeof newData[key] === 'object') {
      if (Object.keys(newData[key]).length === 0) {
        delete newData[key];
      }
    }
  });

  console.log(newData);

  return newData;
};
