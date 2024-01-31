export const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    res.status(400).json({
      data: null,
      message: 'No se subió el archivo requerido',
    });
    return;
  }

  next();
};
