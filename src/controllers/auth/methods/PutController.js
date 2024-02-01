import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registering/registerChange.js';

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
          user_isactive: true,
        },
      });

      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El usuario no existe',
        });
        return;
      }

      const isSamePassword = bcrypt.compareSync(password, user.password);

      if (isSamePassword) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message:
            'La contraseña no puede ser la misma que actualmente utiliza.',
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
          has_changed_def_pass: true,
        },
      });

      res.json({
        data: null,
        message: 'Contraseña actualizada exitosamente',
      });

      if (user.id_employee) {
        registerChange({
          modifyingUser: userId,
          changedTable: 'user',
          changedField: 'password',
          changedFieldLabel: 'Contraseña',
          employeeId: user.id_employee,
          newValue: '***',
          previousValue: '***',
        });
      }
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al actualizar la contraseña`,
      });
    }
  }
}
