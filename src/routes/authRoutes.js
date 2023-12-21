import express from 'express';

import { postLogin } from '../controllers/authControllers.js';

import validateBody from '../middlewares/validateBody.js';

import { post_authSchema } from '../helpers/validationSchemas/authSchemas.js';

const routerAuth = express.Router();

// POST ---------------------------
routerAuth.post(
  '/login',
  (req, res, next) => validateBody(req, res, next, post_authSchema),
  postLogin,
);

export default routerAuth;
