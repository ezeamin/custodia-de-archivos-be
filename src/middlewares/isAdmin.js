import HttpStatus from 'http-status-codes';
import { roles } from '../constants/roles';

export const isAdmin = (req, res, next) => {
  const { user } = req;

  if (user.role !== roles.ADMIN) {
    res.status(HttpStatus.FORBIDDEN).json({
      data: null,
      message: 'No tienes permisos para realizar esta acción',
    });
    return;
  }

  next();
};
