import Joi from 'joi';

export const usernameRules = () =>
  Joi.string()
    .required()
    .trim()
    .min(7)
    .max(8)
    .regex(/^[1-9]\d{6,7}$/)
    .messages({
      'string.empty': 'El campo "nombre de usuario" no puede estar vacio',
      'string.min':
        'El campo "nombre de usuario" debe tener al menos 7 caracteres',
      'string.max':
        'El campo "nombre de usuario" debe tener maximo 8 caracteres',
      'string.pattern.base':
        'El campo "nombre de usuario" debe ser un DNI válido. No puede empezar por 0',
      'any.required': 'El campo "nombre de usuario" es obligatorio',
      '*': 'Revisa el campo "nombre de usuario"',
    });

export const passwordRules = () =>
  Joi.string().required().trim().min(3).max(30).messages({
    'string.empty': 'El campo "contraseña" no puede estar vacio',
    'string.min': 'El campo "contraseña" debe tener al menos 3 caracteres',
    'string.max': 'El campo "contraseña" debe tener máximo 30 caracteres',
    'any.required': 'El campo "contraseña" es obligatorio',
    '*': 'Revisa el campo "contraseña"',
  });
