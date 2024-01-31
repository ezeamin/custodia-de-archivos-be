import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PostController {
  static async createNotification(req, res) {
    const {
      body: { type, receivers, message, files },
      user: { id: userId },
    } = req;
  }

  static async createNotificationType(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
