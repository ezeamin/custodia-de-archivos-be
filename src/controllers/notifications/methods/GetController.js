import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { formatNotifications } from '../../../helpers/formatters/formatNotifications.js';

const ALL_EMPLOYEES_ID = '018d3b85-ad41-789e-b615-cd610c5c12ef';

export class GetController {
  static async notifications(req, res) {
    const {
      query: { hasBeenRead: paramHasBeenRead, sent },
      user: { id: userId },
    } = req;

    const hasBeenRead =
      paramHasBeenRead === undefined ? undefined : paramHasBeenRead === 'true';

    try {
      const data = await prisma.notification.findMany({
        where: {
          notification_isactive: true,
          id_sender: sent ? userId : undefined,
          notification_receiver: {
            some: {
              id_receiver: sent ? undefined : userId,
              has_read_notification: hasBeenRead,
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
        orderBy: {
          notification_created_at: 'desc',
        },
      });

      if (sent) {
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
        return;
      }

      // Received notification

      const notifications = data || [];

      const employeeArea = await prisma.employee.findFirst({
        where: {
          user: {
            some: {
              id_user: userId,
            },
          },
        },
        select: {
          id_area: true,
        },
      });

      if (!employeeArea) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          data: null,
          message: 'Error al obtener las notificaciones',
        });
        return;
      }

      const employeeAreaId = employeeArea.id_area;

      const areaNotifications = await prisma.notification.findMany({
        where: {
          notification_isactive: true,
          id_sender: {
            not: userId,
          },
          notification_receiver: {
            some: {
              id_receiver: {
                in: [employeeAreaId, ALL_EMPLOYEES_ID],
              },
              has_read_notification: hasBeenRead,
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
        orderBy: {
          notification_created_at: 'desc',
        },
      });

      notifications.push(...(areaNotifications || []));

      if (!data) {
        // || no hay data del area o de todos los empleados
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'No se encontraron notificaciones',
        });
        return;
      }

      const formattedData = await formatNotifications({
        data: notifications,
        sent,
      });

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
      const employeeArea = await prisma.employee.findFirst({
        where: {
          user: {
            some: {
              id_user: userId,
            },
          },
        },
        select: {
          id_area: true,
        },
      });

      const data = await prisma.notification.findUnique({
        where: {
          id_notification: notificationId,
          id_sender: sent ? userId : undefined,
          ...(!sent
            ? {
                notification_receiver: {
                  some: {
                    id_receiver: {
                      in: [userId, employeeArea.id_area, ALL_EMPLOYEES_ID],
                    },
                  },
                },
              }
            : {}),
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
        let isArea = false;
        let receiver = data.notification_receiver.find(
          (r) => r.id_receiver === userId,
        );

        if (!receiver) {
          isArea = true;
          receiver = await prisma.notification_area_receiver.findFirst({
            where: {
              id_notification: notificationId,
              id_user: userId,
            },
          });
        }

        // Update to "read" only if that status is false
        if (!receiver.has_read_notification) {
          const receiverId =
            receiver?.id_notification_receiver ||
            receiver?.id_notification_area_receiver;

          const argentineanDate = new Date(
            new Date().toLocaleString('en-US', {
              timeZone: 'America/Argentina/Buenos_Aires',
            }),
          );

          let notificationReceiver;
          if (isArea) {
            notificationReceiver =
              await prisma.notification_area_receiver.update({
                where: {
                  id_notification_area_receiver: receiverId,
                },
                data: {
                  has_read_notification: true,
                  time_read_notification: argentineanDate,
                },
              });
          } else {
            notificationReceiver = await prisma.notification_receiver.update({
              where: {
                id_notification_receiver: receiverId,
                id_notification: notificationId,
                id_receiver: userId,
              },
              data: {
                has_read_notification: true,
                time_read_notification: argentineanDate,
              },
            });
          }

          if (!notificationReceiver) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              data: null,
              message: 'Error al obtener la notificación',
            });
            return;
          }
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

  // @param - notificationId
  // @param - areaId
  static async notificationAreaReceivers(req, res) {
    const {
      params: { notificationId, areaId },
      user: { id: userId },
    } = req;

    try {
      const data = await prisma.notification_area_receiver.findMany({
        where: {
          id_notification: notificationId,
          id_area: areaId,
          NOT: {
            id_user: userId,
          },
        },
        include: {
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
          message: 'No se encontraron receptores de notificación',
        });
        return;
      }

      const formattedData = data.map((receiver) => ({
        id: receiver.id_user,
        name: `${receiver.user.employee.person.surname}, ${receiver.user.employee.person.name}`,
        email: receiver.user.employee.email,
        hasReadNotification: receiver.has_read_notification,
        timeReadNotification: receiver.time_read_notification,
        imgSrc: receiver.user.employee.picture_url,
      }));

      res.json({
        data: formattedData,
        message: 'Receptores obtenidos exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener los receptores de la notificación',
      });
    }
  }

  static async notificationReceivers(req, res) {
    const {
      user: { id: userId },
    } = req;

    try {
      const usersPromise = prisma.user.findMany({
        where: {
          user_isactive: true,
          user_type: {
            user_type: 'employee',
          },
          NOT: {
            id_user: userId,
          },
        },
        include: {
          employee: {
            include: {
              person: true,
            },
          },
        },
        orderBy: {
          employee: {
            person: {
              surname: 'asc',
            },
          },
        },
      });

      const adminUsersPromise = prisma.user.findMany({
        where: {
          user_isactive: true,
          user_type: {
            user_type: 'admin',
          },
          NOT: {
            id_user: userId,
          },
        },
        include: {
          employee: {
            include: {
              person: true,
            },
          },
        },
        orderBy: {
          employee: {
            person: {
              surname: 'asc',
            },
          },
        },
      });

      const areasPromise = prisma.area.findMany({
        where: {
          area_isactive: true,
        },
        orderBy: {
          area: 'asc',
        },
      });

      const [users, admins, areas] = await Promise.all([
        usersPromise,
        adminUsersPromise,
        areasPromise,
      ]);

      const formattedUsers = users.map((user) => ({
        id: user.id_user,
        description: `Empleado - ${user.employee.person.surname}, ${user.employee.person.name}`,
        type: 'user',
      }));

      const formattedAdmins = admins.map((admin) => ({
        id: admin.id_user,
        description: `Administrador - ${admin.employee.person.surname}, ${admin.employee.person.name}`,
        type: 'user',
      }));

      const formattedAreas = areas.map((area) => ({
        id: area.id_area,
        description: `Area - ${area.area}`,
        type: 'area',
      }));

      // Take "Area - Todos los empleados" to top - ALL_EMPLOYEES_ID = 018d3b85-ad41-789e-b615-cd610c5c12ef
      const allEmployeesArea = formattedAreas.find(
        (a) => a.id === ALL_EMPLOYEES_ID,
      );
      if (allEmployeesArea) {
        formattedAreas.splice(formattedAreas.indexOf(allEmployeesArea), 1);
        formattedAreas.unshift({
          ...allEmployeesArea,
          description: 'Todos los empleados',
        });
      }

      const receivers = [
        ...formattedAreas,
        ...formattedAdmins,
        ...formattedUsers,
      ];

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

  static async notificationTypes(req, res) {
    const {
      query: { all = false },
      user: { id: userId },
    } = req;

    try {
      const userType = await prisma.user.findUnique({
        where: {
          id_user: userId,
        },
      });

      if (!userType) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'No se encontró el tipo de usuario',
        });
        return;
      }

      const notificationTypes = await prisma.notification_type.findMany({
        where: {
          notification_type_isactive: true,
          ...(!all
            ? {
                notification_allowed_role: {
                  some: {
                    id_user_type: userType.id_user_type,
                    notification_allowed_role_isactive: true,
                  },
                },
              }
            : {}),
        },
        include: {
          notification_allowed_role: {
            include: {
              user_type: true,
            },
            where: {
              notification_allowed_role_isactive: true,
            },
          },
        },
        orderBy: {
          title_notification: 'asc',
        },
      });

      const formattedData = notificationTypes.map((type) => ({
        id: type.id_notification_type,
        title: type.title_notification,
        description: type.description_notification,
        startHour: type.start_hour,
        endHour: type.end_hour,
        canModify: type.can_modify,
        allowedRoles: type.notification_allowed_role
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
  static async notificationTypeById(req, res) {
    const {
      params: { typeId },
    } = req;

    try {
      const type = await prisma.notification_type.findUnique({
        where: {
          notification_type_isactive: true,
          id_notification_type: typeId,
        },
        include: {
          notification_allowed_role: {
            include: {
              user_type: true,
            },
            where: {
              notification_allowed_role_isactive: true,
            },
          },
        },
      });

      const formattedData = {
        id: type.id_notification_type,
        title: type.title_notification,
        description: type.description_notification,
        startHour: type.start_hour,
        endHour: type.end_hour,
        canModify: type.can_modify,
        allowedRoles: type.notification_allowed_role
          .filter(
            (role) => role.id_notification_type === type.id_notification_type,
          )
          .map((r) => ({
            id: r.user_type.id_user_type,
            description: r.user_type.user_type_label,
          })),
      };

      res.json({
        data: formattedData,
        message: 'Tipo de notificación obtenido exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener el tipo de notificación',
      });
    }
  }
}
