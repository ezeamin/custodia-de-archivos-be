import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class GetController {
  static async notifications(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  // @param - notificationId
  static async notificationById(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  static async notificationReceivers(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  static async notificationTypes(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  // @param - typeId
  static async notificationTypesById(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
