import dayjs from 'dayjs';
import { sendNewNotificationMail } from './mailing/newNotificationEmail.js';
import { prisma } from './prisma.js';

export const createIndividualNotificationReceiverData = async ({
  notificationId,
  areaId,
  userId,
  isAllEmployees = false,
  individualReceivers,
}) => {
  let usersInArea = [];
  usersInArea = await prisma.user.findMany({
    where: {
      ...(!isAllEmployees
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
      area: {
        select: {
          area: true,
          responsible_email: true,
        },
      },
    },
  });

  usersInArea = usersInArea.filter(
    (user) => !individualReceivers.includes(user.id_user),
  );

  if (usersInArea.length === 0) {
    throw new Error(
      'No se encontraron usuarios en el área indicada, o se está enviando por separado a todos los usuarios de esa área',
    );
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
      name: user.employee ? user.employee.person.name : user.area.area,
      email: user.employee ? user.employee.email : user.area.responsible_email,
      notificationId,
      username: user.username,
    });
  });
};

export const createDocumentEntriesInProfile = async ({
  docs,
  areaId,
  userId,
  isAllEmployees = false,
}) => {
  let usersInArea = [];
  usersInArea = await prisma.user.findMany({
    where: {
      ...(!isAllEmployees
        ? {
            employee: {
              id_area: areaId,
            },
          }
        : {}),
      user_isactive: true,
    },
    select: {
      id_user: true,
      username: true,
      employee: {
        include: {
          document_folder: true,
        },
      },
    },
  });

  const employees = usersInArea.map((user) => user.employee).filter(Boolean);

  const todayInArgentina = dayjs().add(3, 'hour').format('DD/MM/YYYY');

  const promises = [];
  employees.forEach((employee) => {
    const id_folder = employee.document_folder.find(
      (folder) => folder.folder_name === 'Notificaciones',
    )?.id_document_folder;

    docs.forEach((doc) => {
      const promise = prisma.employee_doc.create({
        data: {
          employee_doc_name: `${todayInArgentina} - ${doc.name}`,
          employee_doc_url: doc.url,
          employee: {
            connect: {
              id_employee: employee.id_employee,
            },
          },
          user: {
            connect: {
              id_user: userId,
            },
          },
          document_folder: {
            connect: {
              id_document_folder: id_folder,
            },
          },
        },
      });
      promises.push(promise);
    });
  });

  await Promise.all(promises);
};
