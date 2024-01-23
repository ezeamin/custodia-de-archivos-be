import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { calculateDateDiffInAges } from '../../../helpers/helpers.js';

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
        antiquity: calculateDateDiffInAges(employee.employement_date),
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
        message: 'Error retrieving employees',
      });
    }
  }

  // @param - employeeId
  static async employeeById(req, res) {}

  // @param - employeeId
  static async employeeDocs(req, res) {}

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
