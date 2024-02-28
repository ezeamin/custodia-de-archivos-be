import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

import { registerChange } from '../../../helpers/registering/registerChange.js';
import { registerError } from '../../../helpers/registering/registerError.js';

export class DeleteController {
  // @param userId
  static async deleteAdminUser(req, res) {
    const {
      params: { userId },
      user: { id: loggedUserId },
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

      const newUser = await prisma.user.update({
        where: {
          id_user: userId,
        },
        data: {
          user_type: {
            connect: {
              user_type: 'employee',
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Usuario reducido a Empleado exitosamente',
      });

      // Avoid registering change in test environment
      if (process.env.NODE_ENV === 'test') return;

      registerChange({
        modifyingUser: loggedUserId,
        changedTable: 'user_type',
        changedField: 'user_type',
        changedFieldLabel: 'Rol de usuario',
        employeeId: user.id_employee,
        newValue: newUser.id_user_type,
        previousValue: user.id_user_type,
      });
    } catch (error) {
      registerError(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al eliminar el rol del usuario`,
      });
    }
  }

  // @param userId
  static async deleteReadOnlyUser(req, res) {
    const {
      params: { userId },
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

      await prisma.user.update({
        where: {
          id_user: userId,
          user_isactive: true,
        },
        data: {
          user_isactive: false,
          third_party: {
            update: {
              third_party_isactive: false,
              person: {
                update: {
                  person_isactive: false,
                },
              },
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Usuario eliminado exitosamente',
      });
    } catch (error) {
      registerError(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al eliminar el usuario`,
      });
    }
  }
}
