import HttpStatus from 'http-status-codes';

export const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    res.status(HttpStatus.BAD_REQUEST).json({
      data: null,
      message: 'No se subió el archivo requerido',
    });
    return;
  }

  next();
};
