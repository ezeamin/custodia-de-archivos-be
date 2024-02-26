import HttpStatus from 'http-status-codes';
import { commonMimeTypes } from '../constants/mimetypes.js';

function flattenMimeTypes(obj) {
  return Object.values(obj).reduce((acc, val) => acc.concat(val), []);
}

const flattenedMimeTypes = flattenMimeTypes(commonMimeTypes);

export const validateFiles = (req, res, next) => {
  if (!req.file && !req.files) {
    res.status(HttpStatus.BAD_REQUEST).json({
      data: null,
      message: 'No se subió el archivo requerido',
    });
    return;
  }

  // req.file
  if (req.file) {
    const { mimetype } = req.file;
    if (!flattenedMimeTypes.includes(mimetype)) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'El archivo no tiene un formato permitido',
      });
    } else {
      next();
    }

    return;
  }

  // req.files
  const files = Object.values(req.files);
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const { mimetype } = file;
    if (!flattenedMimeTypes.includes(mimetype)) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message:
          'Uno de los archivos no tiene un formato permitido. Suba únicamente imágenes o documentos',
      });
      return;
    }
  }

  next();
};
