import express from 'express';

import {
  getProduct,
  getProducts,
  postProduct,
  deleteProduct,
  putProduct,
} from '../controllers/productControllers.js';

import isAdmin from '../middlewares/isAdmin.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import validateBody from '../middlewares/validateBody.js';
import validateParams from '../middlewares/validateParams.js';

import {
  delete_params_productSchema,
  get_params_productSchema,
  post_productSchema,
  put_params_productSchema,
  put_productSchema,
} from '../helpers/validationSchemas/productSchemas.js';

const routerProducts = express.Router();

// method.(path, (middlewares), controller to be run when the endpoint is hit)

// GET ---------------------------
routerProducts.get('/', getProducts);
routerProducts.get(
  '/:id',
  (req, res, next) => validateParams(req, res, next, get_params_productSchema),
  getProduct,
);

// POST ---------------------------
routerProducts.post(
  '/',
  isAuthenticated,
  isAdmin,
  (req, res, next) => validateBody(req, res, next, post_productSchema),
  postProduct,
);

// PUT ----------------------------
routerProducts.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  (req, res, next) => validateParams(req, res, next, put_params_productSchema),
  (req, res, next) => validateBody(req, res, next, put_productSchema),
  putProduct,
);

// DELETE -------------------------
routerProducts.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  (req, res, next) => validateParams(req, res, next, delete_params_productSchema),
  deleteProduct,
);

export default routerProducts;
