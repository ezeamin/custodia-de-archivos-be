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
  static async createEmployeeAbsence(req, res) {
    const {
      params: { employeeId },
      body: { date, reason },
    } = req;

    try {
      await prisma.absence.create({
        data: {
          date_absence: date,
          reason_absence: reason,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Ausencia creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la ausencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeLicense(req, res) {
    const {
      params: { employeeId },
      body: { typeId, fromDate, toDate, observations },
    } = req;

    console.log(req.body);

    try {
      await prisma.license.create({
        data: {
          start_date_license: fromDate,
          end_date_license: toDate,
          observation_license: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          license_type: {
            connect: {
              id_license_type: typeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Licencia creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la licencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeVacation(req, res) {
    const {
      params: { employeeId },
      body: { fromDate, toDate, observations },
    } = req;

    try {
      await prisma.vacation.create({
        data: {
          start_date_vacation: fromDate,
          end_date_vacation: toDate,
          observation_vacation: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Vacaciones creadas exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear las vacaciones. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeTraining(req, res) {
    const {
      params: { employeeId },
      body: { date, reason, typeId, observations },
    } = req;

    try {
      await prisma.training.create({
        data: {
          date_training: date,
          reason_training: reason,
          observation_training: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          training_type: {
            connect: {
              id_training_type: typeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Capacitación creada exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('date_training')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'La capacitación ingresada ya existe',
          });
          return;
        }
      }

      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la capacitación. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeFormalWarning(req, res) {
    const {
      params: { employeeId },
      body: { date, reason },
    } = req;

    try {
      await prisma.formal_warning.create({
        data: {
          date_formal_warning: date,
          reason_formal_warning: reason,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Amonestación formal creada exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('date_formal_warning')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'La amonestación formal ingresada ya existe',
          });
          return;
        }
      }

      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la amonestación formal. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeLateArrival(req, res) {
    const {
      params: { employeeId },
      body: { date, hour, observations },
    } = req;

    try {
      await prisma.late_arrival.create({
        data: {
          date_late_arrival: date,
          time_late_arrival: hour,
          observation_late_arrival: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Llegada tarde creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la llegada tarde. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeExtraHour(req, res) {
    const {
      params: { employeeId },
      body: { date, hours, observations },
    } = req;

    try {
      await prisma.extra_hours.create({
        data: {
          date_extra_hours: date,
          qty_extra_hours: hours,
          observation_extra_hours: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Hora extra creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la hora extra. Intente de nuevo más tarde.',
      });
    }
  }

  static async createLicenseType(req, res) {
    const { title, description } = req.body;

    try {
      await prisma.license_type.create({
        data: {
          title_license: title,
          description_license: description,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de licencia creado exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('title_license')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El tipo de licencia ingresado ya existe',
          });
          return;
        }
      }

      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el tipo de licencia. Intente de nuevo más tarde.',
      });
    }
  }

  static async createTrainingType(req, res) {
    const { title, description } = req.body;

    try {
      await prisma.training_type.create({
        data: {
          title_training_type: title,
          description_training_type: description,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de capacitación creado exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('title_training')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El tipo de capacitación ingresado ya existe',
          });
          return;
        }
      }

      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el tipo de capacitación. Intente de nuevo más tarde.',
      });
    }
  }
}
