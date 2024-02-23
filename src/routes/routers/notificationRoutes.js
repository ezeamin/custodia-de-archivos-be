import express from 'express';

import { upload } from '../../helpers/multer.js';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { checkRole } from '../../middlewares/checkRole.js';

import { roles } from '../../constants/roles.js';

import { Notifications } from '../../controllers/notifications/index.js';
import { ENDPOINTS } from '../endpoints.js';

export const notificationRouter = express.Router();

// GET ---------------------------
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS,
  isAuthenticated,
  Notifications.GetController.notifications,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_RECEIVERS,
  isAuthenticated,
  Notifications.GetController.notificationReceivers,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_RECEIVERS_BY_AREA,
  isAuthenticated,
  Notifications.GetController.notificationAreaReceivers,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_TYPES,
  isAuthenticated,
  Notifications.GetController.notificationTypes,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATION,
  isAuthenticated,
  Notifications.GetController.notificationById,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_TYPE,
  isAuthenticated,
  Notifications.GetController.notificationTypeById,
);

// POST ---------------------------
notificationRouter.post(
  ENDPOINTS.NOTIFICATIONS.POST_NOTIFICATION,
  isAuthenticated,
  upload.array('files', 5),
  Notifications.PostController.createNotification,
);
notificationRouter.post(
  ENDPOINTS.NOTIFICATIONS.POST_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  Notifications.PostController.createNotificationType,
);

// PUT ----------------------------
notificationRouter.put(
  ENDPOINTS.NOTIFICATIONS.PUT_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  Notifications.PutController.updateNotificationType,
);

// DELETE -------------------------
notificationRouter.delete(
  ENDPOINTS.NOTIFICATIONS.DELETE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  Notifications.DeleteController.deleteNotificationType,
);
