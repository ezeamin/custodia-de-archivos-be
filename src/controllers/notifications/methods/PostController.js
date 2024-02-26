import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { handleUpload } from '../../../helpers/cloudinary.js';
import { sendNewNotificationMail } from '../../../helpers/mailing/newNotificationEmail.js';
import {
  createDocumentEntriesInProfile,
  createIndividualNotificationReceiverData,
} from '../../../helpers/notificationReceivers.js';
import { roles } from '../../../constants/roles.js';

const ALL_EMPLOYEES_ID = '018d3b85-ad41-789e-b615-cd610c5c12ef';

export class PostController {
  static async createNotification(req, res) {
    const {
      body: { typeId, receivers, message, isResponse: isResponseBody },
      user: { id: userId, role: userRole },
      files,
    } = req;

    let docs = [];
    const isResponse = isResponseBody === 'true';

    // Check if user can create this type of notification (roles)
    try {
      const allowedRolesPromise = prisma.notification_allowed_role.findMany({
        where: {
          id_notification_type: typeId,
          notification_allowed_role_isactive: true,
        },
        include: {
          user_type: true,
        },
      });

      const notificationTypesPromise = prisma.notification_type.findMany({
        where: {
          notification_type_isactive: true,
        },
      });

      const [allowedRoles, notificationTypes] = await Promise.all([
        allowedRolesPromise,
        notificationTypesPromise,
      ]);

      if (!allowedRoles.length) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'No se encontró el tipo de notificación',
        });
        return;
      }

      const allowedRolesNames = allowedRoles.map((role) =>
        role.user_type.user_type.toUpperCase(),
      );

      if (!allowedRolesNames.includes(userRole.toUpperCase())) {
        res.status(HttpStatus.FORBIDDEN).json({
          data: null,
          message: 'No tiene permisos para crear este tipo de notificación',
        });
        return;
      }

      const responseNotificationType = notificationTypes.find(
        (type) => type.title_notification.toLowerCase() === 'respuesta',
      );

      if (
        typeId === responseNotificationType.id_notification_type &&
        !isResponse
      ) {
        res.status(HttpStatus.FORBIDDEN).json({
          data: null,
          message:
            'No se puede crear una notificación de tipo "Respuesta" cuando no lo es',
        });
        return;
      }
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear la notificacion',
      });
      return;
    }

    // Check if notification is sent between its type hour restrictions
    try {
      const notificationType = await prisma.notification_type.findUnique({
        where: {
          id_notification_type: typeId,
        },
      });

      if (!notificationType) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'No se encontró el tipo de notificación',
        });
        return;
      }

      const { start_hour: startHour, end_hour: endHour } = notificationType;

      const argentinianTime = new Date().toLocaleString('en-US', {
        timeZone: 'America/Argentina/Buenos_Aires',
      });
      const currentHour = new Date(argentinianTime).getHours();
      const currentMinutes = new Date(argentinianTime).getMinutes();

      const currentTime = `${currentHour}:${currentMinutes}`;

      if (currentTime < startHour || currentTime > endHour) {
        res.status(HttpStatus.FORBIDDEN).json({
          data: null,
          message: `No se puede crear una notificación fuera del horario permitido (${startHour} - ${endHour})`,
        });
        return;
      }
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear la notificacion',
      });
      return;
    }

    // Check file sizes restrictions and upload files to cloudinary
    if (files) {
      // Check file size
      const TEN_MB = 10000000;
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        if (file.size > TEN_MB) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message:
              'El tamaño del archivo es demasiado grande. El máximo permitido es de 10MB',
          });
          return;
        }
        if (file.originalname.length > 250) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: `El nombre del archivo "${file.originalname}" es demasiado largo. El máximo permitido es de 250 caracteres`,
          });
          return;
        }
      }

      // Upload files to cloudinary
      const uploadPromises = [];
      for (let i = 0; i < files.length; i += 1) {
        try {
          const file = files[i];
          const uploadPromise = handleUpload(file, true);
          uploadPromises.push(uploadPromise);
        } catch (e) {
          console.error('🟥', e);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            data: null,
            message:
              'Ocurrió un error al crear el documento. Intente de nuevo más tarde.',
          });
          return;
        }
      }

      const uploadResults = await Promise.all(uploadPromises);
      docs = uploadResults.map((result, index) => ({
        name: files[index].originalname,
        url: result.secure_url,
      }));
    }

    // Check if receiver is "All Employees"
    const receiverHasAllEmployees = receivers.some(
      (receiver) => receiver.id === ALL_EMPLOYEES_ID,
    );

    // Get a list of individual users to send notification
    const individualReceivers = receivers
      .filter((receiver) => receiver.type === 'user')
      .map((receiver) => receiver.id);

    // Create notification
    let newNotification = null;
    try {
      newNotification = await prisma.notification.create({
        data: {
          message,
          notification_type: {
            connect: {
              id_notification_type: typeId,
            },
          },
          user: {
            connect: {
              id_user: userId,
            },
          },
        },
      });

      // Create docs entries (if any)

      const notificationDocsPromises = [];
      try {
        docs.forEach((doc) => {
          const promise = prisma.notification_doc.create({
            data: {
              id_notification: newNotification.id_notification,
              notification_doc_name: doc.name,
              notification_doc_url: doc.url,
            },
          });

          notificationDocsPromises.push(promise);
        });

        // Relate entries to employees docs

        const areasIds = [];
        const userIds = [];
        receivers.forEach((receiver) => {
          if (receiver.type === 'user') userIds.push(receiver.id);
          else areasIds.push(receiver.id);
        });

        userIds.forEach(async (user) => {
          await createDocumentEntriesInProfile({
            docs,
            userId: user,
            submittedBy: userId,
            isAllEmployees: receiverHasAllEmployees,
          });
        });

        areasIds.forEach(async (area) => {
          await createDocumentEntriesInProfile({
            docs,
            areaId: area,
            submittedBy: userId,
            isAllEmployees: receiverHasAllEmployees,
          });
        });

        await Promise.all(notificationDocsPromises);
      } catch (error) {
        console.error('🟥', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          data: null,
          message: 'Error al crear la notificación',
        });
        prisma.notification.delete({
          where: {
            id_notification: newNotification.id_notification,
          },
        });
        prisma.notification_receiver.deleteMany({
          where: {
            id_notification: newNotification.id_notification,
          },
        });
        prisma.notification_area_receiver.deleteMany({
          where: {
            id_notification: newNotification.id_notification,
          },
        });
        prisma.notification_doc.deleteMany({
          where: {
            id_notification: newNotification.id_notification,
          },
        });
        return;
      }

      // Check if sender is employee, or area or admin

      if (userRole === roles.EMPLOYEE) {
        //! Employee -> Area = Send to Area User

        // If sender is employee, then it can send to a user or to an area but, if it is an area,
        // it will create 1 entry and none at notification_area_receiver

        const promises = [];
        receivers.forEach((receiver) => {
          const promise = prisma.notification_receiver.create({
            data: {
              id_receiver: receiver.id,
              notification: {
                connect: {
                  id_notification: newNotification.id_notification,
                },
              },
              receiver_type: {
                connect: {
                  receiver_type: receiver.type,
                },
              },
            },
          });

          promises.push(promise);
        });

        await Promise.all(promises);
      } else {
        //! Admin | Area -> Area | Employee = Send to All Users in Area (not Area User) | Send to User
        // If sender is admin or area, then it can send to a user or to an area but, if it is an area,
        // it will create entries at notification_area_receiver, one for each employee of that area.
        // Area User WON'T receive the notification.

        const promises = [];
        receivers.forEach((receiver) => {
          const promiseNotRec = prisma.notification_receiver.create({
            data: {
              id_receiver: receiver.id,
              notification: {
                connect: {
                  id_notification: newNotification.id_notification,
                },
              },
              receiver_type: {
                connect: {
                  receiver_type: receiver.type,
                },
              },
            },
          });

          if (receiver.type === 'area') {
            // Add entries to notification_area_receiver

            const promiseNotAreaRec = createIndividualNotificationReceiverData({
              areaId: receiver.id,
              notificationId: newNotification.id_notification,
              userId,
              isAllEmployees: receiverHasAllEmployees,
              individualReceivers,
            });

            promises.push(promiseNotAreaRec);
          }

          promises.push(promiseNotRec);
        });

        await Promise.all(promises);
      }

      // Finish process and return response

      res.status(HttpStatus.CREATED).json({
        data: newNotification,
        message: 'Notificación creada exitosamente',
      });
    } catch (error) {
      console.error('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear la notificación',
      });
      return;
    }

    // Send email to receivers

    try {
      receivers.forEach(async (receiver) => {
        if (receiver.type === 'user') {
          const receiverInfo = await prisma.user.findUnique({
            where: {
              id_user: receiver.id,
            },
            include: {
              employee: {
                include: {
                  person: true,
                },
              },
            },
          });

          sendNewNotificationMail({
            name: receiverInfo.employee.person.name,
            email: receiverInfo.employee.email,
            username: receiverInfo.username,
            notificationId: newNotification.id_notification,
          });
        } else if (receiver.type === 'area') {
          const areaInfo = await prisma.area.findUnique({
            where: {
              id_area: receiver.id,
              area_isactive: true,
            },
            include: {
              user: true,
            },
          });

          // TODO: What happens if message is sent to area user, but it wasn't yet created?

          // Send to Area User only
          if (userRole === roles.EMPLOYEE) {
            if (areaInfo.responsible_email && areaInfo.user.length > 0) {
              sendNewNotificationMail({
                name: areaInfo.area,
                email: areaInfo.responsible_email,
                username: areaInfo.user[0].username,
                notificationId: newNotification.id_notification,
              });
            }
          } else {
            // Send to All Employees of Area
            const areaEmployees = await prisma.employee.findMany({
              where: {
                area: {
                  id_area: receiver.id,
                },
                employee_isactive: true,
                user: {
                  none: {
                    id_user: userId,
                  },
                },
              },
              include: {
                person: true,
              },
            });

            areaEmployees.forEach((employee) => {
              sendNewNotificationMail({
                name: employee.person.name,
                email: employee.email,
                username: employee.person.identification_number,
                notificationId: newNotification.id_notification,
              });
            });
          }
        }
      });
    } catch (error) {
      console.error('🟥', error);
    }
  }

  static async createNotificationType(req, res) {
    const {
      body: { title, description, startHour, endHour, allowedRoles },
    } = req;

    try {
      const newNotificationType = await prisma.notification_type.create({
        data: {
          title_notification: title,
          description_notification: description,
          start_hour: startHour,
          end_hour: endHour,
        },
      });

      allowedRoles.forEach(async (role) => {
        await prisma.notification_allowed_role.create({
          data: {
            id_notification_type: newNotificationType.id_notification_type,
            id_user_type: role.id,
          },
        });
      });

      res.status(HttpStatus.CREATED).json({
        data: newNotificationType,
        message: 'Tipo de notificación creado exitosamente',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear el tipo de notificación',
      });
    }
  }
}
