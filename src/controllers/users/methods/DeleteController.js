import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registerChange.js';

export class DeleteController {
  // @param userId
  static async deleteAdminUser(req, res) {
    const {
      params: { userId },
      user: { id: loggedUserId },
    } = req;

    try {
      const user_type = await prisma.user_type.findUnique({
        where: {
          user_type: 'employee',
        },
      });

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
        message: 'Usuario reducido a Empleado exitosamente',
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
        message: `Ocurrió un error al eliminar el rol del usuario`,
      });
    }
  }

  static async deleteReadOnlyUser(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
