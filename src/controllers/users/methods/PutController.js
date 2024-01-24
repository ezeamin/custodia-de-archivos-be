import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PutController {
  static async createAdmin(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
