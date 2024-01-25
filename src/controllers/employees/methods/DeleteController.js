import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registerChange.js';

export class DeleteController {
  // @param - employeeId
  static async deleteEmployee(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  // @param - employeeId
  // @param - docId
  static async deleteEmployeeDoc(req, res) {
    const {
      params: { docId },
    } = req;

    try {
      const doc = await prisma.employee_doc.findUnique({
        where: {
          id_employee_doc: docId,
          employee_doc_isactive: true,
        },
      });

      if (!doc) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El documento no existe',
        });
        return;
      }

      await prisma.employee_doc.update({
        where: {
          id_employee_doc: docId,
        },
        data: {
          employee_doc_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Documento eliminado exitosamente',
      });

      registerChange({
        changedField: 'employee_doc',
        changedFieldLabel: 'Eliminación de Documento',
        changedTable: 'employee_doc',
        previousValue: doc.employee_doc_url,
        newValue: null,
        modifyingUser: req.user.id,
        employeeId: doc.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el documento. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - licenseId
  static async deleteEmployeeLicense(req, res) {
    const {
      params: { licenseId },
    } = req;

    try {
      const license = await prisma.license.findUnique({
        where: {
          id_license: licenseId,
          license_isactive: true,
        },
        include: {
          license_type: true,
        },
      });

      if (!license) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'La licencia no existe',
        });
        return;
      }

      await prisma.license.update({
        where: {
          id_license: licenseId,
          license_isactive: true,
        },
        data: {
          license_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Licencia eliminada exitosamente',
      });

      registerChange({
        changedField: 'license',
        changedFieldLabel: 'Eliminación de Licencia',
        changedTable: 'license',
        previousValue: license.license_type.title_license,
        newValue: null,
        modifyingUser: req.user.id,
        employeeId: license.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar la licencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - vacationId
  static async deleteEmployeeVacation(req, res) {
    const {
      params: { vacationId },
    } = req;

    try {
      const vacation = await prisma.vacation.findUnique({
        where: {
          id_vacation: vacationId,
          vacation_isactive: true,
        },
      });

      if (!vacation) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Las vacaciones no existen',
        });
        return;
      }

      await prisma.vacation.update({
        where: {
          id_vacation: vacationId,
          vacation_isactive: true,
        },
        data: {
          vacation_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Vacaciones eliminadas exitosamente',
      });

      registerChange({
        changedField: 'vacation',
        changedFieldLabel: 'Eliminación de Vacaciones',
        changedTable: 'vacation',
        previousValue: vacation.start_date_vacation,
        newValue: null,
        modifyingUser: req.user.id,
        employeeId: vacation.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar las vacaciones. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - licenseTypeId
  static async deleteLicenseType(req, res) {
    // only set licensetype_isactive to false
    const {
      params: { licenseTypeId },
    } = req;

    try {
      const licenseType = await prisma.license_type.findUnique({
        where: {
          id_license_type: licenseTypeId,
          license_type_isactive: true,
        },
      });

      if (!licenseType) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El tipo de licencia no existe',
        });
        return;
      }

      await prisma.license_type.update({
        where: {
          id_license_type: licenseTypeId,
          license_type_isactive: true,
        },
        data: {
          license_type_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de licencia eliminada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el tipo de licencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - trainingTypeId
  static async deleteTrainingType(req, res) {
    const {
      params: { trainingTypeId },
    } = req;

    try {
      const trainingType = await prisma.training_type.findUnique({
        where: {
          id_training_type: trainingTypeId,
          training_type_isactive: true,
        },
      });

      if (!trainingType) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El tipo de capacitación no existe',
        });
        return;
      }

      await prisma.training_type.update({
        where: {
          id_training_type: trainingTypeId,
          training_type_isactive: true,
        },
        data: {
          training_type_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de capacitación eliminada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el tipo de capacitación. Intente de nuevo más tarde.',
      });
    }
  }
}
