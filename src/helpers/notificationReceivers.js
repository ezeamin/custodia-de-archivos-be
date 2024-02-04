import { sendNewNotificationMail } from './mailing/newNotificationEmail.js';
import { prisma } from './prisma.js';

export const createIndividualNotificationReceiverData = async ({
  notificationId,
  areaId,
  userId,
  isAllEmployees = false,
}) => {
  let usersInArea = [];
  usersInArea = await prisma.user.findMany({
    where: {
      ...(isAllEmployees
        ? {
            employee: {
              id_area: areaId,
            },
          }
        : {}),
      user_isactive: true,
      NOT: {
        id_user: userId,
      },
    },
    select: {
      id_user: true,
      username: true,
      employee: {
        select: {
          email: true,
          person: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      },
    },
  });

  if (usersInArea.length === 0) {
    throw new Error('No se encontraron usuarios en el area indicada');
  }

  // Create entry in notification_area_receiver
  const notificationAreaReceiverData = usersInArea.map((user) => ({
    id_user: user.id_user,
    id_notification: notificationId,
    id_area: areaId,
  }));

  await prisma.notification_area_receiver.createMany({
    data: notificationAreaReceiverData,
  });

  // Send email to each user
  usersInArea.forEach((user) => {
    sendNewNotificationMail({
      name: user.employee.person.name,
      email: user.employee.email,
      notificationId,
      username: user.username,
    });
  });
};
