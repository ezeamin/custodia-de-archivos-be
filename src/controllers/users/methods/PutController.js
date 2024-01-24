import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registerChange.js';

export class PutController {
  // @param userId
  static async createAdmin(req, res) {
    const {
      params: { userId },
      user: { id: loggedUserId },
    } = req;

    try {
      const user_type = await prisma.user_type.findUnique({
        where: {
          user_type: 'admin',
        },
      });

      // To get id_employee for change registration
      const user = await prisma.user.findUnique({
        where: {
          id_user: userId,
        },
      });

      await prisma.user.update({
        where: {
          id_user: userId,
        },
        data: {
          id_user_type: user_type.id_user_type,
        },
      });

      res.json({
        data: null,
        message: 'Usuario actualizado exitosamente',
      });

      registerChange({
        modifyingUser: loggedUserId,
        changedTable: 'user_type',
        changedField: 'user_type',
        changedFieldLabel: 'Rol de usuario',
        employeeId: user.id_employee,
        newValue: user_type.id_user_type,
        previousValue: user.id_user_type,
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al actualizar el usuario`,
      });
    }
  }
}
