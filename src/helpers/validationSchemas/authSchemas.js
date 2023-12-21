import Joi from 'joi';

// ----------------------------
// BODY
// ----------------------------

export const post_authSchema = Joi.object({
  username: Joi.string().required().trim().min(3)
    .max(30)
    .messages({
      'string.empty': 'El campo "username" no puede estar vacio',
      'string.min': 'El campo "username" debe tener al menos 3 caracteres',
      'string.max': 'El campo "username" debe tener maximo 30 caracteres',
      'any.required': 'El campo "username" es obligatorio',
      '*': 'Revisa el campo "username"',
    }),
  password: Joi.string().required().trim().min(3)
    .max(30)
    .messages({
      'string.empty': 'El campo "password" no puede estar vacio',
      'string.min': 'El campo "password" debe tener al menos 3 caracteres',
      'string.max': 'El campo "password" debe tener maximo 30 caracteres',
      'any.required': 'El campo "password" es obligatorio',
      '*': 'Revisa el campo "password"',
    }),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});
