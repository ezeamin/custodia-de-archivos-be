import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated';
import { isAdmin } from '../../middlewares/isAdmin';

import { Notifications } from '../../controllers/notifications';

export const notificationRouter = express.Router();

// GET ---------------------------
notificationRouter.get(
  '/',
  isAuthenticated,
  Notifications.GetController.notifications,
);
notificationRouter.get(
  '/:notificationId',
  isAuthenticated,
  Notifications.GetController.notificationById,
);
notificationRouter.get(
  '/receivers',
  isAuthenticated,
  Notifications.GetController.notificationReceivers,
);
notificationRouter.get(
  '/types',
  isAuthenticated,
  Notifications.GetController.notificationTypes,
);
notificationRouter.get(
  '/types/:typeId',
  isAuthenticated,
  Notifications.GetController.notificationTypesById,
);

// POST ---------------------------
notificationRouter.post(
  '/',
  isAuthenticated,
  Notifications.PostController.createNotification,
);
notificationRouter.post(
  '/types',
  isAuthenticated,
  isAdmin,
  Notifications.PostController.createNotificationType,
);

// PUT ----------------------------
notificationRouter.put(
  '/:notificationId/read',
  isAuthenticated,
  Notifications.PutController.readNotification,
);
notificationRouter.put(
  '/types/:typeId',
  isAuthenticated,
  isAdmin,
  Notifications.PutController.updateNotificationType,
);

// DELETE -------------------------
notificationRouter.delete(
  '/types/:typeId',
  isAuthenticated,
  isAdmin,
  Notifications.DeleteController.deleteNotificationType,
);
