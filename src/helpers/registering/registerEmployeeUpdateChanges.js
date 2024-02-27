import { registerChange } from './registerChange.js';

export const registerEmployeeUpdateChanges = async (
  previousData,
  newData,
  userId,
) => {
  const employeePreviousData = {
    id_status: previousData.id_status,
    id_area: previousData.id_area,
    email: previousData.email,
    position: previousData.position,
    employment_date: previousData.employment_date.toISOString(),
    termination_date: previousData.termination_date
      ? previousData.termination_date.toISOString()
      : null,
    no_file: previousData.no_file,
    working_hours: previousData.working_hours,
    drivers_license_expiration_date:
      previousData.drivers_license_expiration_date,
    health_insurance: previousData.health_insurance,
    preoccupational_checkup: previousData.preoccupational_checkup,
  };
  const personPreviousData = {
    id_gender: previousData.person.id_gender,
    id_family: previousData.person.id_family,
    id_address: previousData.person.id_address,
    id_phone: previousData.person.id_phone,
    id_civil_status: previousData.person.id_civil_status,
    name: previousData.person.name,
    surname: previousData.person.surname,
    birth_date: previousData.person.birth_date.toISOString(),
    identification_number: previousData.person.identification_number,
  };
  const phonePreviousData = previousData.person.phone || null;
  const addressPreviousData = previousData.person.address || null;

  const employeeNewData = newData.employee || null;
  const personNewData = newData.person || null;
  const phoneNewData = newData.phone || null;
  const addressNewData = newData.address || null;
  const localityNewData = newData.locality || null;
  const provinceNewData = newData.province || null;
  const streetNewData = newData.street || null;
  const healthInsuranceNewData = newData.health_insurance || null;
  const preoccupationalCheckupNewData = newData.preoccupational_checkup || null;

  // --------------------------------------------------------
  // A - Employee
  // --------------------------------------------------------

  if (
    employeeNewData &&
    employeeNewData.id_status &&
    employeePreviousData.id_status !== employeeNewData.id_status
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'id_status',
      changedFieldLabel: 'Estado',
      previousValue: employeePreviousData.id_status,
      newValue: employeeNewData.id_status,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.id_area &&
    employeePreviousData.id_area !== employeeNewData.id_area
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'id_area',
      changedFieldLabel: 'Area',
      previousValue: employeePreviousData.id_area,
      newValue: employeeNewData.id_area,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.email &&
    employeePreviousData.email !== employeeNewData.email
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'email',
      changedFieldLabel: 'Email',
      previousValue: employeePreviousData.email,
      newValue: employeeNewData.email,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.position &&
    employeePreviousData.position !== employeeNewData.position
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'position',
      changedFieldLabel: 'Puesto',
      previousValue: employeePreviousData.position,
      newValue: employeeNewData.position,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.employment_date &&
    employeePreviousData.employment_date !== employeeNewData.employment_date
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'employment_date',
      changedFieldLabel: 'Fecha de Ingreso',
      previousValue: employeePreviousData.employment_date,
      newValue: employeeNewData.employment_date,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.termination_date &&
    employeePreviousData.termination_date !== employeeNewData.termination_date
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'termination_date',
      changedFieldLabel: 'Fecha de Egreso',
      previousValue: employeePreviousData.termination_date,
      newValue: employeeNewData.termination_date,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.no_file &&
    employeePreviousData.no_file !== employeeNewData.no_file
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'no_file',
      changedFieldLabel: 'Número de Legajo',
      previousValue: employeePreviousData.no_file,
      newValue: employeeNewData.no_file,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.working_hours &&
    employeePreviousData.working_hours !== employeeNewData.working_hours
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'working_hours',
      changedFieldLabel: 'Horas de Trabajo',
      previousValue: employeePreviousData.working_hours,
      newValue: employeeNewData.working_hours,
    });
  }

  if (
    employeeNewData &&
    employeeNewData.drivers_license_expiration_date &&
    employeePreviousData.drivers_license_expiration_date !==
      employeeNewData.drivers_license_expiration_date
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'drivers_license_expiration_date',
      changedFieldLabel: 'Expiración Carnet de Manejo',
      previousValue: employeePreviousData.drivers_license_expiration_date,
      newValue: employeeNewData.drivers_license_expiration_date,
    });
  }

  if (
    healthInsuranceNewData &&
    JSON.stringify({
      health_insurance: employeePreviousData.health_insurance.health_insurance,
      affiliate_number: employeePreviousData.health_insurance.affiliate_number,
    }) !== JSON.stringify(healthInsuranceNewData)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'health_insurance',
      changedFieldLabel: 'Obra Social',
      previousValue: `${employeePreviousData.health_insurance.health_insurance} - ${employeePreviousData.health_insurance.affiliate_number}`,
      newValue: `${healthInsuranceNewData.health_insurance} - ${healthInsuranceNewData.affiliate_number}`,
    });
  }

  if (
    preoccupationalCheckupNewData &&
    JSON.stringify({
      is_fit: employeePreviousData.preoccupational_checkup.is_fit,
      observations_preoccupational_checkup:
        employeePreviousData.preoccupational_checkup
          .observations_preoccupational_checkup,
    }) !== JSON.stringify(preoccupationalCheckupNewData)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'employee',
      changedField: 'preoccupational_checkup',
      changedFieldLabel: 'Preocupacionales',
      previousValue: `Apto: ${employeePreviousData.preoccupational_checkup.is_fit ? 'Si' : 'No'} - ${employeePreviousData.preoccupational_checkup.observations_preoccupational_checkup}`,
      newValue: `Apto: ${preoccupationalCheckupNewData.is_fit ? 'Si' : 'No'} - ${preoccupationalCheckupNewData.observations_preoccupational_checkup}`,
    });
  }

  // --------------------------------------------------------
  // B - Phone
  // --------------------------------------------------------

  if (
    phoneNewData &&
    phoneNewData.phone_no &&
    (!phonePreviousData || phonePreviousData.phone_no !== phoneNewData.phone_no)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'phone',
      changedField: 'phone_no',
      changedFieldLabel: 'Teléfono',
      previousValue: phonePreviousData ? phonePreviousData.id_phone : null,
      newValue: phoneNewData.id,
    });
  }

  // --------------------------------------------------------
  // C - Address
  // --------------------------------------------------------

  if (
    streetNewData &&
    streetNewData.street_api_id &&
    (!addressPreviousData ||
      addressPreviousData.street_api_id !== streetNewData.street_api_id)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'street',
      changedField: 'street',
      changedFieldLabel: 'Calle',
      previousValue: addressPreviousData
        ? addressPreviousData.street.id_street
        : null,
      newValue: streetNewData.id,
    });
  }

  if (
    localityNewData &&
    localityNewData.locality_api_id &&
    (!addressPreviousData ||
      addressPreviousData.street.locality.locality_api_id !==
        localityNewData.locality_api_id)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'locality',
      changedField: 'locality',
      changedFieldLabel: 'Localidad',
      previousValue: addressPreviousData
        ? addressPreviousData.street.locality.id_locality
        : null,
      newValue: localityNewData.id,
    });
  }

  if (
    provinceNewData &&
    provinceNewData.province_api_id &&
    (!addressPreviousData ||
      addressPreviousData.street.locality.province.province_api_id !==
        provinceNewData.province_api_id)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'province',
      changedField: 'province',
      changedFieldLabel: 'Provincia',
      previousValue: addressPreviousData
        ? addressPreviousData.street.locality.province.id_province
        : null,
      newValue: provinceNewData.id,
    });
  }

  if (
    addressNewData &&
    addressNewData.street_number &&
    (!addressPreviousData ||
      addressPreviousData.street_number !== addressNewData.street_number)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'address',
      changedField: 'street_number',
      changedFieldLabel: 'Número de Puerta',
      previousValue: addressPreviousData
        ? addressPreviousData.street_number
        : null,
      newValue: addressNewData.street_number,
    });
  }

  if (
    addressNewData &&
    addressNewData.door &&
    (!addressPreviousData || addressPreviousData.door !== addressNewData.door)
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'address',
      changedField: 'door',
      changedFieldLabel: 'Departamento',
      previousValue: addressPreviousData ? addressPreviousData.door : null,
      newValue: addressNewData.door,
    });
  }

  // --------------------------------------------------------
  // D - Person
  // --------------------------------------------------------

  if (
    personNewData &&
    personNewData.name &&
    personPreviousData.name !== personNewData.name
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'person',
      changedField: 'name',
      changedFieldLabel: 'Nombre',
      previousValue: personPreviousData.name,
      newValue: personNewData.name,
    });
  }

  if (
    personNewData &&
    personNewData.surname &&
    personPreviousData.surname !== personNewData.surname
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'person',
      changedField: 'surname',
      changedFieldLabel: 'Apellido',
      previousValue: personPreviousData.surname,
      newValue: personNewData.surname,
    });
  }

  if (
    personNewData &&
    personNewData.birth_date &&
    personPreviousData.birth_date !== personNewData.birth_date
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'person',
      changedField: 'birth_date',
      changedFieldLabel: 'Fecha de Nacimiento',
      previousValue: personPreviousData.birth_date,
      newValue: personNewData.birth_date,
    });
  }

  if (
    personNewData &&
    personNewData.identification_number &&
    personPreviousData.identification_number !==
      personNewData.identification_number
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'person',
      changedField: 'identification_number',
      changedFieldLabel: 'CUIL',
      previousValue: personPreviousData.identification_number,
      newValue: personNewData.identification_number,
    });
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'user',
      changedField: 'username',
      changedFieldLabel: 'Nombre de Usuario',
      previousValue: personPreviousData.identification_number,
      newValue: personNewData.identification_number,
    });
  }

  if (
    personNewData &&
    personNewData.id_gender &&
    personPreviousData.id_gender !== personNewData.id_gender
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'gender',
      changedField: 'id_gender',
      changedFieldLabel: 'Género',
      previousValue: personPreviousData.id_gender,
      newValue: personNewData.id_gender,
    });
  }

  if (
    personNewData &&
    personNewData.id_civil_status &&
    personPreviousData.id_civil_status !== personNewData.id_civil_status
  ) {
    registerChange({
      modifyingUser: userId,
      employeeId: previousData.id_employee,
      changedTable: 'civil_status_type',
      changedField: 'id_civil_status',
      changedFieldLabel: 'Estado Civil',
      previousValue: personPreviousData.id_civil_status,
      newValue: personNewData.id_civil_status,
    });
  }
};
