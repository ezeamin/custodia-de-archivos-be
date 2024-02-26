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
  submittedBy,
  isAllEmployees = false,
}) => {
  let employees = [];
  if (areaId) {
    const usersInArea = await prisma.user.findMany({
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

    employees = usersInArea.map((user) => user.employee).filter(Boolean);
  } else {
    // employees
    const employeesData = await prisma.employee.findMany({
      where: {
        user: {
          some: {
            id_user: userId,
            user_isactive: true,
          },
        },
      },
      include: {
        user: true,
        document_folder: true,
      },
    });

    employees = employeesData.filter(Boolean);
  }

  const todayInArgentina = dayjs().add(3, 'hour').format('DD/MM/YYYY');

  const promises = [];
  employees.forEach((employee) => {
    const id_folder = employee.document_folder.find(
      (folder) => folder.folder_name === 'Notificaciones',
    )?.id_document_folder;

    docs.forEach((doc) => {
      let { name } = doc;
      if (name.length > 200) {
        name = name.slice(0, 200).concat('...');
      }

      const promise = prisma.employee_doc.create({
        data: {
          employee_doc_name: `${todayInArgentina} - ${name}`,
          employee_doc_url: doc.url,
          employee: {
            connect: {
              id_employee: employee.id_employee,
            },
          },
          document_folder: {
            connect: {
              id_document_folder: id_folder,
            },
          },
          user: {
            connect: {
              id_user: submittedBy,
            },
          },
        },
      });
      promises.push(promise);
    });
  });

  await Promise.all(promises);
};
