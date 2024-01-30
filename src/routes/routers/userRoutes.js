import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { isAdminOrReadOnly } from '../../middlewares/isAdminOrReadOnly.js';

import { Users } from '../../controllers/users/index.js';
import { ENDPOINTS } from '../endpoints.js';

export const userRouter = express.Router();

// GET ---------------------------
userRouter.get(
  ENDPOINTS.USERS.GET_USERS,
  isAuthenticated,
  isAdminOrReadOnly,
  Users.GetController.users,
);
userRouter.get(
  ENDPOINTS.USERS.GET_LOGIN_LOGS,
  isAuthenticated,
  isAdminOrReadOnly,
  Users.GetController.loginLogs,
);

// POST ---------------------------
userRouter.post(
  ENDPOINTS.USERS.POST_USER,
  isAuthenticated,
  isAdmin,
  Users.PostController.createUser,
);
userRouter.post(
  ENDPOINTS.USERS.POST_READ_ONLY_USER,
  isAuthenticated,
  isAdmin,
  Users.PostController.createReadOnlyUser,
);

// PUT ----------------------------
userRouter.put(
  ENDPOINTS.USERS.PUT_CREATE_ADMIN,
  isAuthenticated,
  isAdmin,
  Users.PutController.createAdmin,
);

// DELETE -------------------------
userRouter.delete(
  ENDPOINTS.USERS.DELETE_ADMIN_USER,
  isAuthenticated,
  isAdmin,
  Users.DeleteController.deleteAdminUser,
);
userRouter.delete(
  ENDPOINTS.USERS.DELETE_READ_ONLY_USER,
  isAuthenticated,
  isAdmin,
  Users.DeleteController.deleteReadOnlyUser,
);
