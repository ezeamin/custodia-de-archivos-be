import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class DeleteController {
  // @param - typeId
  static async deleteNotificationType(req, res) {
    const {
      params: { typeId },
    } = req;

    try {
      const deletedType = await prisma.notification_type.findUnique({
        where: {
          id_notification_type: typeId,
        },
        include: {
          notification_allowed_role: true,
        },
      });

      if (!deletedType) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'No se encontró el tipo de notificación',
        });
        return;
      }

      if (!deletedType.can_modify) {
        res.status(HttpStatus.FORBIDDEN).json({
          data: null,
          message: 'No se puede eliminar el tipo de notificación',
        });
        return;
      }

      await prisma.notification_type.update({
        where: {
          id_notification_type: typeId,
        },
        data: {
          notification_type_isactive: false,
        },
      });

      const allowedRolesIds = deletedType.notification_allowed_role.map(
        (role) => role.id_notification_allowed_role,
      );

      await prisma.notification_allowed_role.deleteMany({
        where: {
          id_notification_allowed_role: {
            in: allowedRolesIds,
          },
        },
      });

      res.json({
        data: deletedType,
        message: 'Tipo de notificación eliminado exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al eliminar el tipo de notificación',
      });
    }
  }
}
