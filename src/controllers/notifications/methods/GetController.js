import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { formatNotifications } from '../../../helpers/formatters/formatNotifications.js';

export class GetController {
  static async notifications(req, res) {
    const {
      query: { hasBeenRead, sent },
      user: { id: userId },
    } = req;

    try {
      const data = await prisma.notification.findMany({
        where: {
          notification_isactive: true,
          id_sender: sent ? userId : undefined,
          notification_receiver: {
            some: {
              id_receiver: sent ? undefined : userId,
              has_read_notification: hasBeenRead === 'true',
            },
          },
        },
        include: {
          notification_type: true,
          notification_doc: true,
          notification_receiver: {
            include: {
              receiver_type: true,
            },
          },
          user: {
            include: {
              employee: {
                include: {
                  person: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'No se encontraron notificaciones',
        });
        return;
      }

      const formattedData = await formatNotifications({ data, sent });

      res.json({
        data: formattedData,
        message: 'Notificaciones obtenidas exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener las notificaciones',
      });
    }
  }

  // @param - notificationId
  static async notificationById(req, res) {
    const {
      params: { notificationId },
      query: { sent },
      user: { id: userId },
    } = req;

    try {
      const data = await prisma.notification.findUnique({
        where: {
          id_notification: notificationId,
          id_sender: sent ? userId : undefined,
          notification_receiver: {
            some: {
              id_receiver: sent ? undefined : userId,
            },
          },
        },
        include: {
          notification_type: true,
          notification_doc: true,
          notification_receiver: {
            include: {
              receiver_type: true,
            },
          },
          user: {
            include: {
              employee: {
                include: {
                  person: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'No se encontró la notificación',
        });
        return;
      }

      // Get read status
      if (!sent) {
        const receiverId = data.notification_receiver.find(
          (r) => r.id_receiver === userId,
        ).id_notification_receiver;

        const notification_receiver = await prisma.notification_receiver.update(
          {
            where: {
              id_notification_receiver: receiverId,
              id_notification: notificationId,
              id_receiver: userId,
            },
            data: {
              has_read_notification: true,
            },
          },
        );

        if (!notification_receiver) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            data: null,
            message: 'Error al obtener la notificación',
          });
          return;
        }
      }

      const formattedData = await formatNotifications({
        data: [data],
        sent,
        userId,
      });

      res.json({
        data: formattedData[0],
        message: 'Notificación obtenida exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener la notificación',
      });
    }
  }

  static async notificationReceivers(_, res) {
    try {
      const usersPromise = prisma.user.findMany({
        where: {
          user_isactive: true,
          user_type: {
            user_type: 'employee',
          },
        },
        include: {
          employee: {
            include: {
              person: true,
            },
          },
        },
      });

      const areasPromise = prisma.area.findMany({
        where: {
          area_isactive: true,
        },
      });

      const [users, areas] = await Promise.all([usersPromise, areasPromise]);

      const formattedUsers = users.map((user) => ({
        id: user.id_user,
        description: `Empleado - ${user.employee.person.surname}, ${user.employee.person.name}`,
        type: 'user',
      }));

      const formattedAreas = areas.map((area) => ({
        id: area.id_area,
        description: `Area - ${area.area}`,
        type: 'area',
      }));

      const receivers = [...formattedUsers, ...formattedAreas];

      res.json({
        data: receivers,
        message: 'Receptores de notificación obtenidos exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener los receptores de la notificación',
      });
    }
  }

  static async notificationTypes(_, res) {
    try {
      const notificationTypes = await prisma.notification_type.findMany();
      const allowedRoles = await prisma.notification_allowed_role.findMany({
        include: {
          user_type: true,
        },
      });

      const formattedData = notificationTypes.map((type) => ({
        id: type.id_notification_type,
        title: type.title_notification,
        description: type.description_notification,
        startHour: type.start_hour,
        endHour: type.end_hour,
        allowedRoles: allowedRoles
          .filter(
            (role) => role.id_notification_type === type.id_notification_type,
          )
          .map((r) => ({
            id: r.user_type.id_user_type,
            description: r.user_type.user_type_label,
          })),
      }));

      res.json({
        data: formattedData,
        message: 'Tipos de notificación obtenidos exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener los tipos de notificación',
      });
    }
  }

  // @param - typeId
  static async notificationTypesById(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
