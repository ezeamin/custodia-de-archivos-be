import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { isAdminOrReadOnly } from '../../middlewares/isAdminOrReadOnly.js';

import { Users } from '../../controllers/users/index.js';
import { ENDPOINTS } from '../endpoints.js';

import { validateBody } from '../../middlewares/validateBody.js';
import { validateParams } from '../../middlewares/validateParams.js';
import { validateQuery } from '../../middlewares/validateQuery.js';
import {
  delete_params_deleteAdminSchema,
  delete_params_deleteReadOnlySchema,
  get_query_loginLogsSchema,
  get_query_userSchema,
  post_readOnlyUserSchema,
  post_userSchema,
  put_params_createAdminSchema,
} from '../../helpers/validationSchemas/userSchemas.js';

export const userRouter = express.Router();

// GET ---------------------------
userRouter.get(
  ENDPOINTS.USERS.GET_USERS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) => validateQuery(req, res, next, get_query_userSchema),
  Users.GetController.users,
);
userRouter.get(
  ENDPOINTS.USERS.GET_LOGIN_LOGS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) => validateQuery(req, res, next, get_query_loginLogsSchema),
  Users.GetController.loginLogs,
);

// POST ---------------------------
userRouter.post(
  ENDPOINTS.USERS.POST_USER,
  isAuthenticated,
  isAdmin,
  (req, res, next) => validateBody(req, res, next, post_userSchema),
  Users.PostController.createUser,
);
userRouter.post(
  ENDPOINTS.USERS.POST_READ_ONLY_USER,
  isAuthenticated,
  isAdmin,
  (req, res, next) => validateBody(req, res, next, post_readOnlyUserSchema),
  Users.PostController.createReadOnlyUser,
);

// PUT ----------------------------
userRouter.put(
  ENDPOINTS.USERS.PUT_CREATE_ADMIN,
  isAuthenticated,
  isAdmin,
  (req, res, next) =>
    validateParams(req, res, next, put_params_createAdminSchema),
  Users.PutController.createAdmin,
);

// DELETE -------------------------
userRouter.delete(
  ENDPOINTS.USERS.DELETE_ADMIN_USER,
  isAuthenticated,
  isAdmin,
  (req, res, next) =>
    validateParams(req, res, next, delete_params_deleteAdminSchema),
  Users.DeleteController.deleteAdminUser,
);
userRouter.delete(
  ENDPOINTS.USERS.DELETE_READ_ONLY_USER,
  isAuthenticated,
  isAdmin,
  (req, res, next) =>
    validateParams(req, res, next, delete_params_deleteReadOnlySchema),
  Users.DeleteController.deleteReadOnlyUser,
);
