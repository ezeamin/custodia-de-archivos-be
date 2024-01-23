import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class GetController {
  static async notifications(req, res) {}

  // @param - notificationId
  static async notificationById(req, res) {}

  static async notificationReceivers(req, res) {}

  static async notificationTypes(req, res) {}

  // @param - typeId
  static async notificationTypesById(req, res) {}
}
