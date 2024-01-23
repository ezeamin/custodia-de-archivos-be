import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { handleUpload } from '../../../helpers/cloudinary.js';

export class PostController {
  static async createEmployee(req, res) {
    let imageUrl = '';

    // Check if image was sent
    if (!req.file) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No se ha enviado una imagen',
      });
      return;
    }

    // Check image size
    const FIVE_MB = 5000000;
    if (req.file.size > FIVE_MB) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message:
          'El tamaño de la imagen es demasiado grande. El máximo permitido es de 5MB',
      });
      return;
    }

    // Upload image to cloudinary
    try {
      const { url } = await handleUpload(req);

      const splitUrl = url.split('/upload/');
      imageUrl = `${splitUrl[0]}/upload/w_300,h_300,c_fill,g_face/${splitUrl[1]}`;
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
      if (e.code === 'P2002') {
        if (e.meta.target.includes('identification_number')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El DNI ingresado ya existe',
          });
          return;
        }

        if (e.meta.target.includes('email')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El email ingresado ya existe',
          });
          return;
        }

        if (e.meta.target.includes('no_file')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El número de legajo ingresado ya existe',
          });
          return;
        }
      }

      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeDoc(req, res) {
    const {
      params: { employeeId },
    } = req;

    let docUrl = '';

    // Check if file was sent
    if (!req.file) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No se ha enviado un archivo',
      });
      return;
    }

    // Check file size
    const FIVE_MB = 5000000;
    if (req.file.size > FIVE_MB) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message:
          'El tamaño del archivo es demasiado grande. El máximo permitido es de 5MB',
      });
      return;
    }

    // Upload file to cloudinary
    try {
      const { url } = await handleUpload(req, true);
      docUrl = url;
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el documento. Intente de nuevo más tarde.',
      });
      return;
    }

    const fileExt = req.file.originalname.split('.').pop();
    const filename = `${req.body.name}.${fileExt}`;

    // Supposing that the body has been validated and sanitized
    try {
      await prisma.employee_doc.create({
        data: {
          employee_doc_name: filename,
          employee_doc_url: docUrl,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Documento creado exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el documento. Intente de nuevo más tarde.',
      });
    }
  }

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
