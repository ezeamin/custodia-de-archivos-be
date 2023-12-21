import HttpStatus from 'http-status-codes';

const isAdmin = (req, res, next) => {
  const { user } = req;

  if (!user.isAdmin) {
    res.status(HttpStatus.FORBIDDEN).json({
      data: null,
      message: 'No tienes permisos para realizar esta acción',
    });
    return;
  }

  next();
};

export default isAdmin;
