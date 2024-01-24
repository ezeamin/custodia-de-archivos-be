import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { deleteFile } from '../../../helpers/cloudinary.js';
import { registerChange } from '../../../helpers/registerChange.js';

export class DeleteController {
  // @param - employeeId
  static async deleteEmployee(req, res) {}

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
  static async deleteEmployeeLicense(req, res) {}

  // @param - employeeId
  // @param - vacationId
  static async deleteEmployeeVacation(req, res) {}

  // @param - licenseTypeId
  static async deleteLicenseType(req, res) {}

  // @param - trainingTypeId
  static async deleteTrainingType(req, res) {}
}
