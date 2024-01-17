import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { envs } from './helpers/envs.js';
import mainRouter from './routes/mainRouter.js';

console.clear(); // Clear any previous console logs
console.log('⌛ Initiating server...');

// 1- Initialize server
const app = express();

// 2- Server configurations
const { PORT } = envs;
const whitelist = [
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

// 3- Middlewares
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json()); // <== Parse body as JSON (otherwise "undefined")
app.use(express.urlencoded({ extended: true })); // <== Parse body as URL encoded data
app.use(cookieParser()); // <== Parse cookies

// 4- Routes
app.use('/api/v1', mainRouter);

// 5- Server loop
app.listen(PORT, () => {
  console.log(`✅ Server up and running -> Port ${PORT}\n`);
});
