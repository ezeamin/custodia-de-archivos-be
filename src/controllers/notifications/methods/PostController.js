import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { handleUpload } from '../../../helpers/cloudinary.js';

export class PostController {
  static async createNotification(req, res) {
    const {
      body: { typeId, receivers, message },
      user: { id: userId },
      files,
    } = req;

    let docs = [];

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
      }

      // Upload files to cloudinary
      const uploadPromises = [];
      for (let i = 0; i < files.length; i += 1) {
        try {
          const uploadPromise = handleUpload(req, true);
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

    try {
      const newNotification = await prisma.notification.create({
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

      const receiver_types = await prisma.receiver_type.findMany();

      await prisma.notification_receiver.createMany({
        data: JSON.parse(receivers).map((receiver) => ({
          id_notification: newNotification.id_notification,
          id_receiver: receiver.id,
          id_receiver_type: receiver_types.find(
            (r) => r.receiver_type === receiver.type,
          ).id_receiver_type,
        })),
      });

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
