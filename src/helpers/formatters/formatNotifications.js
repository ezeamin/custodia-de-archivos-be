import { getDownloadLink } from '../cloudinary.js';
import { prisma } from '../prisma.js';

const DEFAULT_IMAGE_URL =
  'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg';

const formatReceiver = async (receiver) => {
  let receiverData = {};
  if (receiver.receiver_type.receiver_type === 'user') {
    receiverData = await prisma.user.findUnique({
      where: {
        id_user: receiver.id_receiver,
      },
      include: {
        employee: {
          include: {
            person: true,
          },
        },
      },
    });
  } else {
    receiverData = await prisma.area.findUnique({
      where: {
        id_area: receiver.id_receiver,
      },
    });
  }

  return {
    id: receiver.id_receiver,
    name:
      receiver.receiver_type.receiver_type === 'user'
        ? `Empleado - ${receiverData.employee.person.surname}, ${receiverData.employee.person.name}`
        : `Área - ${receiverData.area}`,
    imgSrc:
      receiver.receiver_type.receiver_type === 'user'
        ? receiverData.employee.picture_url
        : DEFAULT_IMAGE_URL,
    email:
      receiver.receiver_type.receiver_type === 'user'
        ? receiverData.employee.email
        : '',
    hasReadNotification: receiver.has_read_notification,
    timeReadNotification: receiver.time_read_notification,
  };
};

const formatReceivedNotifications = async (data, hasBeenRead) => {
  const formattedData = data.map(async (item) => {
    const filesPromises = item.notification_doc.map(async (doc) => ({
      id: doc.id_notification_doc,
      name: doc.notification_doc_name,
      url: await getDownloadLink(doc.notification_doc_url),
    }));

    const files = await Promise.all(filesPromises);

    return {
      id: item.id_notification,
      message: item.message,
      issuer: {
        id: item.user.id_user,
        firstname: item.user.employee
          ? item.user.employee.person.name
          : item.user.area.area,
        lastname: item.user.employee
          ? item.user.employee.person.surname
          : 'Area',
        email: item.user.employee
          ? item.user.employee.email
          : item.user.area.responsible_email,
        imgSrc: item.user.employee
          ? item.user.employee.picture_url
          : DEFAULT_IMAGE_URL,
      },
      type: {
        id: item.notification_type.id_notification_type,
        title: item.notification_type.title_notification,
        description: item.notification_type.description_notification,
      },
      hasBeenRead,
      date: item.notification_date,
      files,
    };
  });

  const result = await Promise.all(formattedData);

  return result;
};

export const formatNotifications = async ({ data, sent, hasBeenRead }) => {
  if (!sent) {
    const res = await formatReceivedNotifications(data, hasBeenRead);
    return res;
  }

  // Sent notifications formatting

  const resultPromises = data.map(async (item) => {
    const receiversPromises = [];
    for (let i = 0; i < item.notification_receiver.length; i += 1) {
      const receiver = item.notification_receiver[i];
      receiversPromises.push(formatReceiver(receiver));
    }

    const filesPromises = item.notification_doc.map(async (doc) => ({
      id: doc.id_notification_doc,
      name: doc.notification_doc_name,
      url: await getDownloadLink(doc.notification_doc_url),
    }));

    const receivers = await Promise.all(receiversPromises);
    const files = await Promise.all(filesPromises);

    return {
      id: item.id_notification,
      message: item.message,
      issuer: {
        id: item.user.id_user,
        firstname: item.user.employee.person.name,
        lastname: item.user.employee.person.surname,
        email: item.user.employee.email,
        imgSrc: item.user.employee.picture_url,
      },
      receivers,
      type: {
        id: item.notification_type.id_notification_type,
        title: item.notification_type.title_notification,
        description: item.notification_type.description_notification,
      },
      date: item.notification_created_at,
      files,
    };
  });

  const result = await Promise.all(resultPromises);
  return result;
};
