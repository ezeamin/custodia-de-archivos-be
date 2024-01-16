import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

import { Users } from '../../controllers/users/index.js';

export const userRouter = express.Router();

// GET ---------------------------

// POST ---------------------------
userRouter.post('/', isAuthenticated, isAdmin, Users.PostController.createUser);

// PUT ----------------------------

// DELETE -------------------------
