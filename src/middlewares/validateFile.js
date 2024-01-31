export const validateFile = (req, res, next, fileName) => {
  if (!req.file || (Array.isArray(req.file) && !req.file[fileName])) {
    res.status(400).json({
      data: null,
      message: 'No se subió el archivo requerido',
    });
    return;
  }

  next();
};
