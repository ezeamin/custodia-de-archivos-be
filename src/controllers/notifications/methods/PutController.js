import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PutController {
  // @param - typeId
  static async updateNotificationType(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
