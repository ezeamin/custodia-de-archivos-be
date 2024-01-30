import express from 'express';
import mainRouter from './routes/mainRouter.js';

export const app = express();

app.use('/api/v1', mainRouter);
