import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

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
  Params.GetController.areas,
);
paramsRouter.get(
  ENDPOINTS.PARAMS.GET_CIVIL_STATUS,
  isAuthenticated,
  Params.GetController.civilStatus,
);
