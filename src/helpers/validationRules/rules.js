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
  Joi.string()
    .required()
    .trim()
    .min(6)
    .max(25)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    .messages({
      'string.empty': 'El campo "contraseña" no puede estar vacio',
      'string.min': 'El campo "contraseña" debe tener al menos 6 caracteres',
      'string.max': 'El campo "contraseña" debe tener máximo 25 caracteres',
      'string.pattern.base':
        'El campo "contraseña" debe tener al menos una mayúscula, una minúscula y un número',
      'any.required': 'El campo "contraseña" es obligatorio',
      '*': 'Revisa el campo "contraseña"',
    });
