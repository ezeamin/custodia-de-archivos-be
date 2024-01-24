import { toUTC } from './helpers.js';
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
    employment_date: toUTC(previousData.employment_date),
    termination_date: toUTC(previousData.termination_date),
    no_file: previousData.no_file,
    working_hours: previousData.working_hours,
  };
  const personPreviousData = {
    id_gender: previousData.person.id_gender,
    id_family: previousData.person.id_family,
    id_address: previousData.person.id_address,
    id_phone: previousData.person.id_phone,
    name: previousData.person.name,
    surname: previousData.person.surname,
    birth_date: toUTC(previousData.person.birth_date),
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
      changedField: 'working_hours',
      changedFieldLabel: 'Horas de Trabajo',
      previousValue: employeePreviousData.working_hours,
      newValue: employeeNewData.working_hours,
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
      changedField: 'phone_no',
      changedFieldLabel: 'Teléfono',
      previousValue: phonePreviousData ? phonePreviousData.phone_no : null,
      newValue: phoneNewData.phone_no,
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
      changedField: 'street',
      changedFieldLabel: 'Calle',
      previousValue: addressPreviousData
        ? addressPreviousData.street.street
        : null,
      newValue: streetNewData.street,
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
      changedField: 'locality',
      changedFieldLabel: 'Localidad',
      previousValue: addressPreviousData
        ? addressPreviousData.street.locality.locality
        : null,
      newValue: localityNewData.locality,
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
      changedField: 'province',
      changedFieldLabel: 'Provincia',
      previousValue: addressPreviousData
        ? addressPreviousData.street.locality.province.province
        : null,
      newValue: provinceNewData.province,
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
      changedField: 'street_number',
      changedFieldLabel: 'Número',
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
      changedField: 'identification_number',
      changedFieldLabel: 'DNI',
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
      changedField: 'id_gender',
      changedFieldLabel: 'Género',
      previousValue: personPreviousData.id_gender,
      newValue: personNewData.id_gender,
    });
  }

  // if (personNewData.family)
};
