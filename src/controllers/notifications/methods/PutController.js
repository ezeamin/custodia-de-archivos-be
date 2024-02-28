import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

import { registerError } from '../../../helpers/registering/registerError.js';

export class PutController {
  // @param - typeId
  static async updateNotificationType(req, res) {
    const {
      params: { typeId },
      body: { title, description, startHour, endHour, allowedRoles },
    } = req;

    try {
      const type = await prisma.notification_type.findUnique({
        where: {
          id_notification_type: typeId,
          notification_type_isactive: true,
        },
        include: {
          notification_allowed_role: {
            include: {
              user_type: true,
            },
          },
        },
      });

      if (!type.can_modify) {
        res.status(HttpStatus.FORBIDDEN).json({
          data: null,
          message: 'No se puede modificar el tipo de notificación',
        });
        return;
      }

      const userTypeIdInactiveRoles = type.notification_allowed_role
        .map(
          (role) =>
            !role.notification_allowed_role_isactive && role.id_user_type,
        )
        .filter(Boolean);

      const userTypeIdAllowedRoles = allowedRoles.map((role) => role.id);
      const userTypeIdCurrentRoles = type.notification_allowed_role
        .map((role) =>
          role.notification_allowed_role_isactive ? role.id_user_type : null,
        )
        .filter(Boolean);

      const userTypeIdRolesToDelete = userTypeIdCurrentRoles.filter(
        (role) => !userTypeIdAllowedRoles.includes(role),
      );
      const userTypeIdRolesToAdd = userTypeIdAllowedRoles.filter(
        (role) =>
          !userTypeIdCurrentRoles.includes(role) &&
          !userTypeIdInactiveRoles.includes(role),
      );
      const userTypeIdRolesToActive = userTypeIdAllowedRoles.filter((role) =>
        userTypeIdInactiveRoles.includes(role),
      );

      // We need id_notification_allowed_role and not id_user_type to search and update
      const notificationTypeIdToDelete = type.notification_allowed_role
        .filter((role) => userTypeIdRolesToDelete.includes(role.id_user_type))
        .map((role) => role.id_notification_allowed_role);

      const rolesToDelete = notificationTypeIdToDelete.map((role) => ({
        where: {
          id_notification_allowed_role: role,
        },
        data: {
          notification_allowed_role_isactive: false,
        },
      }));

      const notificacionTypeIdToActive = type.notification_allowed_role
        .filter((role) => userTypeIdRolesToActive.includes(role.id_user_type))
        .map((role) => role.id_notification_allowed_role);

      const createPromise = prisma.notification_allowed_role.createMany({
        data: userTypeIdRolesToAdd.map((role) => ({
          id_user_type: role,
          id_notification_type: typeId,
        })),
      });

      const activePromise = prisma.notification_allowed_role.updateMany({
        where: {
          id_notification_allowed_role: {
            in: notificacionTypeIdToActive,
          },
          notification_allowed_role_isactive: false,
        },
        data: {
          notification_allowed_role_isactive: true,
        },
      });

      const updatePromise = prisma.notification_type.update({
        where: {
          id_notification_type: typeId,
        },
        data: {
          title_notification: title,
          description_notification: description,
          start_hour: startHour,
          end_hour: endHour,
          notification_allowed_role: {
            updateMany: rolesToDelete,
          },
        },
      });

      await Promise.all([createPromise, activePromise, updatePromise]);

      res.json({
        data: null,
        message: 'Tipo de notificación actualizado exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al actualizar el tipo de notificación',
      });
    }
  }
}
