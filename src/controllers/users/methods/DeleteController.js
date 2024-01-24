import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class DeleteController {
  static async deleteAdminUser(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  static async deleteReadOnlyUser(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
