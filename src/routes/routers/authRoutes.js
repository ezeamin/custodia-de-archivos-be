import express from 'express';

import { validateBody } from '../../middlewares/validateBody.js';

import {
  post_loginSchema,
  post_recoverPasswordSchema,
  post_resetPasswordSchema,
} from '../../helpers/validationSchemas/authSchemas.js';

import { Auth } from '../../controllers/auth/index.js';

export const authRouter = express.Router();

// GET ---------------------------
authRouter.get('/refresh-token', Auth.GetController.refreshToken);

// POST ---------------------------
authRouter.post(
  '/login',
  (req, res, next) => validateBody(req, res, next, post_loginSchema),
  Auth.PostController.login,
);

authRouter.post('/logout', Auth.PostController.logout);

authRouter.post(
  '/recover-password',
  (req, res, next) => validateBody(req, res, next, post_recoverPasswordSchema),
  Auth.PostController.recoverPassword,
);

// PUT ----------------------------
authRouter.put(
  '/reset-password',
  (req, res, next) => validateBody(req, res, next, post_resetPasswordSchema),
  Auth.PutController.resetPassword,
);
