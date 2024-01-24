import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PutController {
  // @param - notificationId
  static async readNotification(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  // @param - typeId
  static async updateNotificationType(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
