import express from 'express';

import { upload } from '../../helpers/multer.js';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

import { Notifications } from '../../controllers/notifications/index.js';
import { ENDPOINTS } from '../endpoints.js';

import { validateFile } from '../../middlewares/validateFile.js';

export const notificationRouter = express.Router();

// GET ---------------------------
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS,
  isAuthenticated,
  Notifications.GetController.notifications,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATION,
  isAuthenticated,
  Notifications.GetController.notificationById,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_RECEIVERS,
  isAuthenticated,
  Notifications.GetController.notificationReceivers,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_TYPES,
  isAuthenticated,
  Notifications.GetController.notificationTypes,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_TYPE,
  isAuthenticated,
  Notifications.GetController.notificationTypesById,
);

// POST ---------------------------
notificationRouter.post(
  ENDPOINTS.NOTIFICATIONS.POST_NOTIFICATION,
  isAuthenticated,
  upload.array('files', 5),
  (req, res, next) => validateFile(req, res, next),
  Notifications.PostController.createNotification,
);
notificationRouter.post(
  ENDPOINTS.NOTIFICATIONS.POST_TYPE,
  isAuthenticated,
  isAdmin,
  Notifications.PostController.createNotificationType,
);

// PUT ----------------------------
notificationRouter.put(
  ENDPOINTS.NOTIFICATIONS.PUT_READ_NOTIFICATION,
  isAuthenticated,
  Notifications.PutController.readNotification,
);
notificationRouter.put(
  ENDPOINTS.NOTIFICATIONS.PUT_TYPE,
  isAuthenticated,
  isAdmin,
  Notifications.PutController.updateNotificationType,
);

// DELETE -------------------------
notificationRouter.delete(
  ENDPOINTS.NOTIFICATIONS.DELETE_TYPE,
  isAuthenticated,
  isAdmin,
  Notifications.DeleteController.deleteNotificationType,
);
