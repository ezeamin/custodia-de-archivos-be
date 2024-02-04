import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { handleUpload } from '../../../helpers/cloudinary.js';
import { sendNewNotificationMail } from '../../../helpers/mailing/newNotificationEmail.js';

export class PostController {
  static async createNotification(req, res) {
    const {
      body: { typeId, receivers, message, isResponseBody },
      user: { id: userId, role: userRole },
      files,
    } = req;

    let docs = [];
    const isResponse = isResponseBody === 'true';

    // Check if user can create this type of notification
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

      // Receivers

      const receiverTypes = await prisma.receiver_type.findMany();
      const allEmployeesReceiverId = receiverTypes.find((r) =>
        r.receiver_type.toLowerCase().includes('todos'),
      )?.id_receiver_type;

      const receiverHasAllEmployees =
        JSON.parse(receivers).findIndex((receiver) =>
          receiver.type.toLowerCase().includes('todos'),
        ) !== -1;

      if (receiverHasAllEmployees) {
        // Create a single notification_receiver entry (all employees)
        await prisma.notification_receiver.create({
          data: {
            id_notification: newNotification.id_notification,
            id_receiver: userId,
            id_receiver_type: allEmployeesReceiverId,
          },
        });
      } else {
        await prisma.notification_receiver.createMany({
          data: JSON.parse(receivers).map((receiver) => ({
            id_notification: newNotification.id_notification,
            id_receiver: receiver.id,
            id_receiver_type: receiverTypes.find(
              (r) => r.receiver_type === receiver.type,
            ).id_receiver_type,
          })),
        });
      }

      // Create docs entries (if any)

      const notificationDocsPromises = [];
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

      await Promise.all(notificationDocsPromises);

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
    JSON.parse(receivers).forEach(async (receiver) => {
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

        // TODO: What happens if receiver is not an employee: For eg. "Recursos Humanos"?
        // TODO: What happens when you send to an area the notification? -> Should sent to all employees of that area
        // TODO: Check performance of this query, it awaits searchs for each user in the list of receivers

        sendNewNotificationMail({
          name: receiverInfo.employee.person.name,
          email: receiverInfo.employee.email,
          username: receiverInfo.username,
          notificationId: newNotification.id_notification,
        });
      }
    });
  }

  static async createNotificationType(req, res) {
    const {
      body: { title, description, startHour, endHour, allowedRoles },
    } = req;

    // TODO: Add check for allowedRoles: minimum of 1 role

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
