import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import mainRouter from './routes/mainRouter.js';

import { envs } from './helpers/envs.js';

const app = express();

// CORS
const whitelist = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://custodia-archivos.netlify.app',
];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(console.error(`🟥 Not allowed by CORS -> ${origin}`));
    }
  },
};

// Middlewares
if (envs.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
  app.use(cors(corsOptions));
}
app.use(express.json()); // <== Parse body as JSON (otherwise "undefined")
app.use(express.urlencoded({ extended: true })); // <== Parse body as URL encoded data
app.use(cookieParser()); // <== Parse cookies

// Routes
app.use('/api/v1', mainRouter);

export { app };
