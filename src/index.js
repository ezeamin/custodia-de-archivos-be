import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { envs } from './helpers/envs.js';
import { app } from './app.js';

console.clear(); // Clear any previous console logs
console.log('⌛ Initiating server...');

// Server configurations
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

// Middlewares
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json()); // <== Parse body as JSON (otherwise "undefined")
app.use(express.urlencoded({ extended: true })); // <== Parse body as URL encoded data
app.use(cookieParser()); // <== Parse cookies

// Server loop
app.listen(PORT, () => {
  console.log(`✅ Server up and running -> Port ${PORT}\n`);
});
