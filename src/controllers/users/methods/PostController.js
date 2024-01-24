import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PostController {
  static async createUser(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  static async createReadOnlyUser(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
