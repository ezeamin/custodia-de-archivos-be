import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

import { Users } from '../../controllers/users/index.js';

export const userRouter = express.Router();

// GET ---------------------------
userRouter.get('/', isAuthenticated, isAdmin, Users.GetController.users);

// POST ---------------------------
userRouter.post('/', isAuthenticated, isAdmin, Users.PostController.createUser);
userRouter.post(
  '/create-read-only',
  isAuthenticated,
  isAdmin,
  Users.PostController.createReadOnlyUser,
);

// PUT ----------------------------
userRouter.put(
  '/create-admin/:userId',
  isAuthenticated,
  isAdmin,
  Users.PutController.createAdmin,
);

// DELETE -------------------------
userRouter.delete(
  '/delete-admin/:userId',
  isAuthenticated,
  isAdmin,
  Users.DeleteController.deleteUser,
);
