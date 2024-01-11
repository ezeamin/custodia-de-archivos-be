import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import routerProducts from './routes/productsRoutes.js';
import routerAuth from './routes/authRoutes.js';
// import routerUsers from './routes/userRoutes.js';
import { envs } from './helpers/envs.js';

console.clear(); // Clear any previous console logs
console.log('⌛ Inicializando servidor...');

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
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// 3- Middlewares
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json()); // <== Parse body as JSON (otherwise "undefined")
app.use(cookieParser()); // <== Parse cookies

// 4- Routes
// app.use('/api/v1/products', routerProducts);
app.use('/api/v1/auth', routerAuth);
// app.use('/api/v1/users', routerUsers);

// 5- Server loop
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado -> Puerto ${PORT}\n`);
});
