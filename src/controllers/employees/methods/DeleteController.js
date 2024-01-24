import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { deleteFile } from '../../../helpers/cloudinary.js';
import { registerChange } from '../../../helpers/registerChange.js';

export class DeleteController {
  // @param - employeeId
  static async deleteEmployee(req, res) {
    res.sendStatus(500);
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
        },
      });

      if (!doc) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El documento no existe',
        });
        return;
      }

      await prisma.employee_doc.delete({
        where: {
          id_employee_doc: docId,
        },
      });

      await deleteFile(doc.employee_doc_url);

      res.json({
        data: null,
        message: 'Documento eliminado exitosamente',
      });

      registerChange({
        changedField: 'employee_doc',
        changedFieldLabel: 'Eliminación de Documento',
        previousValue: doc.employee_doc_name,
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

      await prisma.license.delete({
        where: {
          id_license: licenseId,
        },
      });

      res.json({
        data: null,
        message: 'Licencia eliminada exitosamente',
      });

      registerChange({
        changedField: 'license',
        changedFieldLabel: 'Eliminación de Licencia',
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
        },
      });

      if (!vacation) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Las vacaciones no existen',
        });
        return;
      }

      await prisma.vacation.delete({
        where: {
          id_vacation: vacationId,
        },
      });

      res.json({
        data: null,
        message: 'Vacaciones eliminadas exitosamente',
      });

      registerChange({
        changedField: 'vacation',
        changedFieldLabel: 'Eliminación de Vacaciones',
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
    res.sendStatus(500);
  }

  // @param - trainingTypeId
  static async deleteTrainingType(req, res) {
    res.sendStatus(500);
  }
}
