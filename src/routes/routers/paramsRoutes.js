import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { checkRole } from '../../middlewares/checkRole.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { validateQuery } from '../../middlewares/validateQuery.js';
import { validateParams } from '../../middlewares/validateParams.js';

import { roles } from '../../constants/roles.js';

import {
  delete_params_areaSchema,
  get_params_areaSchema,
  get_query_areasSchema,
  get_query_rolesSchema,
  post_areaSchema,
  put_areaSchema,
  put_params_areaSchema,
} from '../../helpers/validationSchemas/paramSchemas.js';

import { Params } from '../../controllers/params/index.js';
import { ENDPOINTS } from '../endpoints.js';

export const paramsRouter = express.Router();

// GET ---------------------------
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_RELATIONSHIPS,
  isAuthenticated,
  Params.GetController.relationships,
);
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_STATUS,
  isAuthenticated,
  Params.GetController.status,
);
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_ROLES,
  isAuthenticated,
  (req, res, next) => validateQuery(req, res, next, get_query_rolesSchema),
  Params.GetController.roles,
);
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_GENDERS,
  isAuthenticated,
  Params.GetController.genders,
);
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_AREAS,
  isAuthenticated,
  (req, res, next) => validateQuery(req, res, next, get_query_areasSchema),
  Params.GetController.areas,
);
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_AREA,
  isAuthenticated,
  (req, res, next) => validateParams(req, res, next, get_params_areaSchema),
  Params.GetController.area,
);
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_CIVIL_STATUS,
  isAuthenticated,
  Params.GetController.civilStatus,
);

// POST ---------------------------
paramsRouter.post(
  ENDPOINTS.PARAMS.POST_AREA,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  (req, res, next) => validateBody(req, res, next, post_areaSchema),
  Params.PostController.createArea,
);

// PUT ---------------------------
paramsRouter.put(
  ENDPOINTS.PARAMS.PUT_AREA,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  (req, res, next) => validateParams(req, res, next, put_params_areaSchema),
  (req, res, next) => validateBody(req, res, next, put_areaSchema),
  Params.PutController.updateArea,
);

// DELETE ---------------------------
paramsRouter.delete(
  ENDPOINTS.PARAMS.DELETE_AREA,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN]),
  (req, res, next) => validateParams(req, res, next, delete_params_areaSchema),
  Params.DeleteController.deleteArea,
);
