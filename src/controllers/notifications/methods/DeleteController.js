import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class DeleteController {
  // @param - typeId
  static async deleteNotificationType(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
