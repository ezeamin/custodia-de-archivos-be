import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { handleUpload } from '../../../helpers/cloudinary.js';

export class PostController {
  static async createEmployee(req, res) {
    let imageUrl = '';

    if (!req.file) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No se ha enviado una imagen',
      });
      return;
    }

    // Upload image to cloudinary
    try {
      const { url } = await handleUpload(req);
      imageUrl = url;
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el empleado. Intente de nuevo más tarde.',
      });
      return;
    }

    // Supposing that the body has been validated and sanitized
    try {
      await prisma.employee.create({
        data: {
          email: req.body.email,
          employment_date: req.body.startDate,
          position: req.body.position,
          no_file: +req.body.fileNumber,
          picture_url: imageUrl,
          person: {
            create: {
              name: req.body.name,
              surname: req.body.lastname,
              identification_number: +req.body.dni,
              birth_date: req.body.birthdate,
              id_gender: req.body.genderId,
            },
          },
          area: {
            connect: {
              id_area: req.body.areaId,
            },
          },
          employee_status: {
            connect: {
              title_status: 'active',
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Empleado creado exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeDoc(req, res) {}

  // @param - employeeId
  static async createEmployeeAbsence(req, res) {}

  // @param - employeeId
  static async createEmployeeLicense(req, res) {}

  // @param - employeeId
  static async createEmployeeVacation(req, res) {}

  // @param - employeeId
  static async createEmployeeTraining(req, res) {}

  // @param - employeeId
  static async createEmployeeFormalWarning(req, res) {}

  // @param - employeeId
  static async createEmployeeLateArrival(req, res) {}

  // @param - employeeId
  static async createEmployeeExtraHour(req, res) {}

  static async createLicenseType(req, res) {}

  static async createTrainingType(req, res) {}
}
