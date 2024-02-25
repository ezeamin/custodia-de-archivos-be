import express from 'express';

import { upload } from '../../helpers/multer.js';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { checkRole } from '../../middlewares/checkRole.js';

import { roles } from '../../constants/roles.js';

import { Notifications } from '../../controllers/notifications/index.js';
import { ENDPOINTS } from '../endpoints.js';
import { validateQuery } from '../../middlewares/validateQuery.js';
import {
  get_params_notificationAreaReceiversSchema,
  get_params_notificationByIdSchema,
  get_params_notificationTypeByIdSchema,
  get_query_notificationByIdSchema,
  get_query_notificationTypesSchema,
  get_query_notificationsSchema,
  post_notificationSchema,
  post_notificationTypeSchema,
  put_notificationTypeSchema,
  put_params_notificationTypeSchema,
} from '../../helpers/validationSchemas/notificationSchemas.js';
import { validateParams } from '../../middlewares/validateParams.js';
import { validateBody } from '../../middlewares/validateBody.js';

export const notificationRouter = express.Router();

// GET ---------------------------
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS,
  isAuthenticated,
  (req, res, next) =>
    validateQuery(req, res, next, get_query_notificationsSchema),
  Notifications.GetController.notifications,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATION,
  isAuthenticated,
  (req, res, next) =>
    validateParams(req, res, next, get_params_notificationByIdSchema),
  (req, res, next) =>
    validateQuery(req, res, next, get_query_notificationByIdSchema),
  Notifications.GetController.notificationById,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_RECEIVERS,
  isAuthenticated,
  Notifications.GetController.notificationReceivers,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_RECEIVERS_BY_AREA,
  isAuthenticated,
  (req, res, next) =>
    validateParams(req, res, next, get_params_notificationAreaReceiversSchema),
  Notifications.GetController.notificationAreaReceivers,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_TYPES,
  isAuthenticated,
  (req, res, next) =>
    validateQuery(req, res, next, get_query_notificationTypesSchema),
  Notifications.GetController.notificationTypes,
);
notificationRouter.get(
  ENDPOINTS.NOTIFICATIONS.GET_TYPE,
  isAuthenticated,
  (req, res, next) =>
    validateParams(req, res, next, get_params_notificationTypeByIdSchema),
  Notifications.GetController.notificationTypeById,
);

// POST ---------------------------
notificationRouter.post(
  ENDPOINTS.NOTIFICATIONS.POST_NOTIFICATION,
  isAuthenticated,
  upload.array('files', 5),
  (req, res, next) => validateBody(req, res, next, post_notificationSchema),
  Notifications.PostController.createNotification,
);
notificationRouter.post(
  ENDPOINTS.NOTIFICATIONS.POST_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  (req, res, next) => validateBody(req, res, next, post_notificationTypeSchema),
  Notifications.PostController.createNotificationType,
);

// PUT ----------------------------
notificationRouter.put(
  ENDPOINTS.NOTIFICATIONS.PUT_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_notificationTypeSchema),
  (req, res, next) => validateBody(req, res, next, put_notificationTypeSchema),
  Notifications.PutController.updateNotificationType,
);

// DELETE -------------------------
notificationRouter.delete(
  ENDPOINTS.NOTIFICATIONS.DELETE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  Notifications.DeleteController.deleteNotificationType,
);
