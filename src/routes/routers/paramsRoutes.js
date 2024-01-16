import express from 'express';

import { Params } from '../../controllers/params/index.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

export const paramsRouter = express.Router();

// GET ---------------------------
paramsRouter.get('/roles', isAuthenticated, Params.GetController.roles);
paramsRouter.get('/genders', isAuthenticated, Params.GetController.genders);
paramsRouter.get('/areas', isAuthenticated, Params.GetController.areas);
