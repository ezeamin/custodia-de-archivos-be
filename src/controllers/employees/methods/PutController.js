import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registerChange.js';

export class PutController {
  // @param - employeeId
  static async updateEmployee(req, res) {}

  // @param - employeeId
  static async updateEmployeeImage(req, res) {}

  // @param - employeeId
  // @param - docId
  static async updateEmployeeDoc(req, res) {
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

      const previousNameExtension = doc.employee_doc_name.split('.');
      const newName = `${req.body.name}.${previousNameExtension.pop()}`;

      await prisma.employee_doc.update({
        where: {
          id_employee_doc: docId,
        },
        data: {
          employee_doc_name: newName,
        },
      });

      res.json({
        data: null,
        message: 'Documento actualizado exitosamente',
      });

      registerChange({
        changedField: 'employee_doc_name',
        changedFieldLabel: 'Nombre de Documento',
        previousValue: doc.employee_doc_name,
        newValue: newName,
        modifyingUser: req.user.id,
        employeeId: doc.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar el documento. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - licenseTypeId
  static async updateLicenseType(req, res) {}

  // @param - trainingTypeId
  static async updateTrainingType(req, res) {}
}
