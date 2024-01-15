import express from 'express';

import { Users } from '../../controllers/users/index.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';

export const userRouter = express.Router();

// GET ---------------------------

// POST ---------------------------
userRouter.post('/', isAuthenticated, isAdmin, Users.PostController.createUser);

// PUT ----------------------------

// DELETE -------------------------
