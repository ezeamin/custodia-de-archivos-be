import HttpStatus from 'http-status-codes';
import { roles } from '../constants/roles.js';

export const isAdminOrReadOnly = (req, res, next) => {
  const { user } = req;

  if (!(user.role === roles.ADMIN || user.role === roles.THIRD_PARTY)) {
    res.status(HttpStatus.FORBIDDEN).json({
      data: null,
      message: 'No tiene permisos para realizar esta acción',
    });
    return;
  }

  next();
};
