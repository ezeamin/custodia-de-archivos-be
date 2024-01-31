import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PutController {
  // @param - typeId
  static async updateNotificationType(req, res) {
    // CHECK IF CAN_MODIFY OF THAT TYPE IS TRUE
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
