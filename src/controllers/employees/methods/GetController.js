import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import {
  calculateDateDiffInAges,
  toLocalTz,
} from '../../../helpers/helpers.js';
import { getDownloadLink } from '../../../helpers/cloudinary.js';

export class GetController {
  static async employees(req, res) {
    const {
      query: { page = 0, entries = 10 },
    } = req;

    try {
      const countPromise = prisma.employee.count();
      const dataPromise = prisma.employee.findMany({
        skip: page * entries,
        take: +entries,
        include: {
          area: true,
          person: true,
          employee_status: true,
        },
      });

      const [count, data] = await Promise.all([countPromise, dataPromise]);

      const formattedData = data.map((employee) => ({
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
        status: {
          id: employee.id_status,
          description: employee.employee_status.title_status,
        },
      }));

      res.json({
        data: formattedData,
        totalElements: count,
        message: 'Employees retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener los empleados. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeById(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const employee = await prisma.employee.findUnique({
        where: {
          id_employee: employeeId,
        },
        include: {
          area: true,
          person: {
            include: {
              home: true,
              phone: true,
              family: true,
              gender: true,
            },
          },
          employee_status: true,
        },
      });

      const formattedData = {
        id: employee.id_employee,
        dni: employee.person.identification_number,
        imgSrc: employee.picture_url,
        lastname: employee.person.surname,
        firstname: employee.person.name,
        birthdate: toLocalTz(employee.person.birth_date),
        address: employee.person.home
          ? {
              street: employee.person.home.street,
              streetNumber: employee.person.home.street_number,
              apt: employee.person.home.door,
              state: employee.person.home.province,
              locality: employee.person.home.locality,
            }
          : null,
        phone: employee.person.phone ? employee.person.phone.phone_no : null,
        email: employee.email,
        gender: {
          id: employee.person.id_gender,
          description: employee.person.gender.gender,
        },
        startDate: toLocalTz(employee.employment_date),
        endDate: toLocalTz(employee.termination_date),
        user: employee.id_user
          ? {
              id: employee.id_user,
            }
          : null,
        age: calculateDateDiffInAges(employee.person.birth_date),
        antiquity: calculateDateDiffInAges(employee.employment_date),
        position: employee.position,
        area: {
          id: employee.area.id_area,
          description: employee.area.area,
        },
        fileNumber: employee.no_file,
        status: {
          id: employee.id_status,
          description: employee.employee_status.title_status,
        },
      };

      res.json({
        data: formattedData,
        message: 'Employee retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener el empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeDocs(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const docs = await prisma.employee_doc.findMany({
        where: {
          id_employee: employeeId,
        },
      });

      const formattedData = docs.map((doc) => ({
        id: doc.id_employee_doc,
        name: doc.employee_doc_name,
        url: getDownloadLink(doc.employee_doc_url),
      }));

      res.json({
        data: formattedData,
        message: 'Employee documents retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener los documentos del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeHistory(req, res) {}

  // @param - employeeId
  static async employeeAbsences(req, res) {}

  // @param - employeeId
  static async employeeLicenses(req, res) {}

  // @param - employeeId
  static async employeeVacations(req, res) {}

  // @param - employeeId
  static async employeeTrainings(req, res) {}

  // @param - employeeId
  static async employeeFormalWarnings(req, res) {}

  // @param - employeeId
  static async employeeLateArrivals(req, res) {}

  // @param - employeeId
  static async employeeExtraHours(req, res) {}

  static async licensesTypes(req, res) {}

  // @param - licenseTypeId
  static async licensesTypesById(req, res) {}

  static async trainingsTypes(req, res) {}

  // @param - trainingTypeId
  static async trainingsTypesById(req, res) {}
}
