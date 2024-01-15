import express from 'express';

import { authRouter } from './routers/authRoutes.js';
import { paramsRouter } from './routers/paramsRoutes.js';
import { employeeRouter } from './routers/employeeRoutes.js';
import { notificationRouter } from './routers/notificationRoutes.js';
import { userRouter } from './routers/userRoutes.js';

const mainRouter = express.Router();

mainRouter.use('/params', paramsRouter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/employees', employeeRouter);
mainRouter.use('/notifications', notificationRouter);
mainRouter.use('/users', userRouter);

export default mainRouter;
