import express from 'express';

import {
  postLogin,
  postRecoverPassword,
} from '../controllers/authControllers.js';

import validateBody from '../middlewares/validateBody.js';

import {
  post_loginSchema,
  post_recoverPasswordSchema,
} from '../helpers/validationSchemas/authSchemas.js';

const routerAuth = express.Router();

// POST ---------------------------
routerAuth.post(
  '/login',
  (req, res, next) => validateBody(req, res, next, post_loginSchema),
  postLogin,
);

routerAuth.post(
  '/recover-password',
  (req, res, next) => validateBody(req, res, next, post_recoverPasswordSchema),
  postRecoverPassword,
);

export default routerAuth;
