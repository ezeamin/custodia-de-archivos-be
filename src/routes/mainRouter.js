import express from 'express';

import { authRouter } from './routers/authRoutes.js';
import { paramsRouter } from './routers/paramsRoutes.js';
import { employeeRouter } from './routers/employeeRoutes.js';
import { notificationRouter } from './routers/notificationRoutes.js';
import { userRouter } from './routers/userRoutes.js';
import { ENDPOINTS } from './endpoints.js';

const mainRouter = express.Router();

mainRouter.use(ENDPOINTS.PARAMS.ROOT, paramsRouter);
mainRouter.use(ENDPOINTS.AUTH.ROOT, authRouter);
mainRouter.use(ENDPOINTS.EMPLOYEES.ROOT, employeeRouter);
mainRouter.use(ENDPOINTS.NOTIFICATIONS.ROOT, notificationRouter);
mainRouter.use(ENDPOINTS.USERS.ROOT, userRouter);

export default mainRouter;
