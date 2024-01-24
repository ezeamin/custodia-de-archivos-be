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
  static async employeeHistory(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const history = await prisma.employee_history.findMany({
        where: {
          id_employee: employeeId,
        },
        include: {
          user: true,
        },
      });

      const formattedData = history.map((record) => ({
        id: record.id_employee_history,
        date: toLocalTz(record.modification_date),
        field: record.modified_field_label,
        previousValue: record.previous_value,
        newValue: record.current_value,
        user: {
          id: record.id_modifying_user,
          description: record.user.username,
        },
      }));

      res.json({
        data: formattedData,
        message: 'Employee history retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener el historial del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeAbsences(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const absences = await prisma.absence.findMany({
        where: {
          id_employee: employeeId,
        },
      });

      const formattedData = absences.map((absence) => ({
        id: absence.id_absence,
        date: toLocalTz(absence.date_absence),
        reason: absence.reason_absence,
      }));

      res.json({
        data: formattedData,
        message: 'Employee absences retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las ausencias del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeLicenses(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const licenses = await prisma.license.findMany({
        where: {
          id_employee: employeeId,
        },
        include: {
          license_type: true,
        },
      });

      const formattedData = licenses.map((license) => ({
        id: license.id_license,
        startDate: toLocalTz(license.start_date_license),
        endDate: toLocalTz(license.end_date_license),
        type: {
          id: license.license_type.id_license_type,
          description: license.license_type.title_license,
        },
        observations: license.observation_license,
      }));

      res.json({
        data: formattedData,
        message: 'Employee licenses retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las licencias del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeVacations(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const vacations = await prisma.vacation.findMany({
        where: {
          id_employee: employeeId,
        },
      });

      const formattedData = vacations.map((vacation) => ({
        id: vacation.id_vacation,
        startDate: toLocalTz(vacation.start_date_vacation),
        endDate: toLocalTz(vacation.end_date_vacation),
        observations: vacation.observation_vacation,
      }));

      res.json({
        data: formattedData,
        message: 'Employee vacations retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener las vacaciones del empleado',
      });
    }
  }

  // @param - employeeId
  static async employeeTrainings(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const trainings = await prisma.training.findMany({
        where: {
          id_employee: employeeId,
        },
        include: {
          training_type: true,
        },
      });

      const formattedData = trainings.map((training) => ({
        id: training.id_training,
        date: toLocalTz(training.date_training),
        reason: training.reason_training,
        type: {
          id: training.training_type.id_training_type,
          description: training.training_type.title_training_type,
        },
        observations: training.observation_training,
      }));

      res.json({
        data: formattedData,
        message: 'Employee trainings retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener los entrenamientos del empleado',
      });
    }
  }

  // @param - employeeId
  static async employeeFormalWarnings(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const formalWarnings = await prisma.formal_warning.findMany({
        where: {
          id_employee: employeeId,
        },
      });

      const formattedData = formalWarnings.map((formalWarning) => ({
        id: formalWarning.id_formal_warning,
        date: formalWarning.date_formal_warning,
        reason: formalWarning.reason_formal_warning,
      }));

      res.json({
        data: formattedData,
        message: 'Employee formal warnings retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las advertencias formales del empleado',
      });
    }
  }

  // @param - employeeId
  static async employeeLateArrivals(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const lateArrivals = await prisma.late_arrival.findMany({
        where: {
          id_employee: employeeId,
        },
      });

      const formattedData = lateArrivals.map((lateArrival) => ({
        id: lateArrival.id_late_arrival,
        date: lateArrival.date_late_arrival,
        time: lateArrival.time_late_arrival,
        observations: lateArrival.observation_late_arrival,
      }));

      res.json({
        data: formattedData,
        message: 'Employee late arrivals retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las llegadas tarde del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeExtraHours(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const extraHours = await prisma.extra_hours.findMany({
        where: {
          id_employee: employeeId,
        },
      });

      const formattedData = extraHours.map((extraHour) => ({
        id: extraHour.id_extra_hours,
        date: extraHour.date_extra_hours,
        hours: extraHour.qty_extra_hours,
        observations: extraHour.observation_extra_hours,
      }));

      res.json({
        data: formattedData,
        message: 'Employee extra hours retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las horas extras del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  static async licensesTypes(_, res) {
    try {
      const types = await prisma.license_type.findMany();

      const formattedData = types.map((type) => ({
        id: type.id_license_type,
        title: type.title_license,
        description: type.description_license,
      }));

      res.json({
        data: formattedData,
        message: 'License types retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener los tipos de licencia',
      });
    }
  }

  // @param - licenseTypeId
  static async licensesTypesById(req, res) {
    res.sendStatus(400);
  }

  static async trainingsTypes(req, res) {
    try {
      const types = await prisma.training_type.findMany();

      const formattedData = types.map((type) => ({
        id: type.id_training_type,
        title: type.title_training_type,
        description: type.description_training_type,
      }));

      res.json({
        data: formattedData,
        message: 'Training types retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener los tipos de entrenamiento',
      });
    }
  }

  // @param - trainingTypeId
  static async trainingsTypesById(req, res) {
    res.sendStatus(400);
  }
}
