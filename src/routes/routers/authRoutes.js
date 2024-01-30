import express from 'express';

import { validateBody } from '../../middlewares/validateBody.js';

import {
  post_loginSchema,
  post_recoverPasswordSchema,
  post_resetPasswordSchema,
} from '../../helpers/validationSchemas/authSchemas.js';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

import { Auth } from '../../controllers/auth/index.js';
import { ENDPOINTS } from '../endpoints.js';

export const authRouter = express.Router();

// POST ---------------------------
authRouter.post(
  ENDPOINTS.AUTH.POST_LOGIN,
  (req, res, next) => validateBody(req, res, next, post_loginSchema),
  Auth.PostController.login,
);
authRouter.post(
  ENDPOINTS.AUTH.POST_REFRESH_TOKEN,
  Auth.PostController.refreshToken,
);
authRouter.post(ENDPOINTS.AUTH.POST_LOGOUT, Auth.PostController.logout);
authRouter.post(
  ENDPOINTS.AUTH.POST_RECOVER_PASSWORD,
  (req, res, next) => validateBody(req, res, next, post_recoverPasswordSchema),
  Auth.PostController.recoverPassword,
);

// PUT ----------------------------
authRouter.put(
  ENDPOINTS.AUTH.PUT_RESET_PASSWORD,
  isAuthenticated,
  (req, res, next) => validateBody(req, res, next, post_resetPasswordSchema),
  Auth.PutController.resetPassword,
);
