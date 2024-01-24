import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../helpers/prisma.js';

export class PutController {
  static async resetPassword(req, res) {
    const {
      body: { password },
      user: { id: userId },
    } = req;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id_user: userId,
        },
      });

      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El usuario no existe',
        });
        return;
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      await prisma.user.update({
        where: {
          id_user: userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      res.json({
        data: null,
        message: 'Contraseña actualizada exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al actualizar la contraseña`,
      });
    }
  }
}
