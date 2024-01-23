import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class DeleteController {
  // @param - employeeId
  static async deleteEmployee(req, res) {}

  // @param - employeeId
  // @param - docId
  static async deleteEmployeeDoc(req, res) {}

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
