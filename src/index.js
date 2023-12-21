import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// DB connection establishment
import './database/database.js';

import routerProducts from './routes/productsRoutes.js';
import routerAuth from './routes/authRoutes.js';
import routerUsers from './routes/userRoutes.js';

console.clear(); // Clear any previous console logs
console.log('⌛ Inicializando servidor...');

// 1- Initialize server
const app = express();

// 2- Server configurations
const PORT = process.env.PORT || 5000;

// 3- Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json()); // <== Parse body as JSON (otherwise "undefined")

// 4- Routes
app.use('/api/v1/products', routerProducts);
app.use('/api/v1/auth', routerAuth);
app.use('/api/v1/users', routerUsers);

// 5- Server loop
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado -> Puerto ${PORT}\n`);
});
