export const checkRole = (req, res, next, allowedRoles) => {
  const { user } = req;

  if (allowedRoles.includes(user.role)) {
    next();
  } else {
    res.status(403).json({
      data: null,
      message: 'No tienes permisos para realizar esta acción',
    });
  }
};
