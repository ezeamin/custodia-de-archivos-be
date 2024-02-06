import { calculateDateDiffInAges } from '../helpers.js';

export const formatEmployeesData = (employees) =>
  employees.map((employee) => ({
    id: employee.id_employee,
    dni: employee.person.identification_number,
    imgSrc: employee.picture_url,
    lastname: employee.person.surname,
    firstname: employee.person.name,
    age: calculateDateDiffInAges(employee.person.birth_date),
    antiquity: calculateDateDiffInAges(employee.employment_date),
    position: employee.position,
    area: {
      id: employee.area.id_area,
      description: employee.area.area,
    },
    fileNumber: employee.no_file,
    driversLicenseDate: employee.drivers_license_expiration_date,
    status: {
      id: employee.id_status,
      description: employee.employee_status.status,
    },
  }));
