import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import { envs } from '../helpers/envs.js';

const secretKey = envs.JWT_SECRET_KEY;

export const isAuthenticated = (req, res, next) => {
  const { headers } = req;
  const authHeader = headers.authorization; // string

  if (!authHeader) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      data: null,
      message: 'Token no detectado en el header "Authorization"',
    });
    return;
  }

  // Separate the word "Bearer" from the token
  const token = authHeader.split(' ')[1];

  try {
    const tokenInfo = jwt.verify(token, secretKey);

    req.user = tokenInfo.user;

    // valid token
    next();
  } catch (err) {
    // invalid token
    res.status(HttpStatus.UNAUTHORIZED).json({
      data: null,
      message: 'Token no valido o expirado',
    });
  }
};
