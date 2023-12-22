import Joi from 'joi';

// ----------------------------
// BODY
// ----------------------------

export const post_userSchema = Joi.object({
  firstname: Joi.string().required().trim().min(3).max(30).messages({
    'string.empty': 'El campo "firstname" no puede estar vacio',
    'string.min': 'El campo "firstname" debe tener al menos 3 caracteres',
    'string.max': 'El campo "firstname" debe tener maximo 30 caracteres',
    'any.required': 'El campo "firstname" es obligatorio',
    '*': 'Revisa el campo "firstname"',
  }),
  lastname: Joi.string().required().trim().min(3).max(30).messages({
    'string.empty': 'El campo "lastname" no puede estar vacio',
    'string.min': 'El campo "lastname" debe tener al menos 3 caracteres',
    'string.max': 'El campo "lastname" debe tener maximo 30 caracteres',
    'any.required': 'El campo "lastname" es obligatorio',
    '*': 'Revisa el campo "lastname"',
  }),
  username: Joi.string().required().trim().min(3).max(30).messages({
    'string.empty': 'El campo "username" no puede estar vacio',
    'string.min': 'El campo "username" debe tener al menos 3 caracteres',
    'string.max': 'El campo "username" debe tener maximo 30 caracteres',
    'any.required': 'El campo "username" es obligatorio',
    '*': 'Revisa el campo "username"',
  }),
  password: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/,
    )
    .messages({
      'string.empty': 'El campo "password" no puede estar vacio',
      'string.min': 'El campo "password" debe tener al menos 3 caracteres',
      'string.max': 'El campo "password" debe tener maximo 30 caracteres',
      'any.required': 'El campo "password" es obligatorio',
      'string.pattern.base':
        'El campo "password" debe tener al menos un numero, una letra y un caracter especial',
      '*': 'Revisa el campo "password"',
    }),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

// copy post validation but remove "required" option
export const put_userSchema = Joi.object({
  firstname: Joi.string().trim().min(3).max(30).messages({
    'string.empty': 'El campo "firstname" no puede estar vacio',
    'string.min': 'El campo "firstname" debe tener al menos 3 caracteres',
    'string.max': 'El campo "firstname" debe tener maximo 30 caracteres',
    '*': 'Revisa el campo "firstname"',
  }),
  lastname: Joi.string().trim().min(3).max(30).messages({
    'string.empty': 'El campo "lastname" no puede estar vacio',
    'string.min': 'El campo "lastname" debe tener al menos 3 caracteres',
    'string.max': 'El campo "lastname" debe tener maximo 30 caracteres',
    '*': 'Revisa el campo "lastname"',
  }),
  username: Joi.string().trim().min(3).max(30).messages({
    'string.empty': 'El campo "username" no puede estar vacio',
    'string.min': 'El campo "username" debe tener al menos 3 caracteres',
    'string.max': 'El campo "username" debe tener maximo 30 caracteres',
    '*': 'Revisa el campo "username"',
  }),
  password: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/,
    )
    .messages({
      'string.empty': 'El campo "password" no puede estar vacio',
      'string.min': 'El campo "password" debe tener al menos 3 caracteres',
      'string.max': 'El campo "password" debe tener maximo 30 caracteres',
      'string.pattern.base':
        'El campo "password" debe tener al menos un numero, una letra y un caracter especial',
      '*': 'Revisa el campo "password"',
    }),
  isAdmin: Joi.boolean().messages({
    'boolean.base': 'El campo "isAdmin" debe ser un booleano',
    '*': 'Revisa el campo "isAdmin"',
  }),
})
  .custom((value, helpers) => {
    // At least one field
    const { firstname, lastname, username, password, isAdmin } = value;

    if (!firstname && !lastname && !username && !password && !isAdmin) {
      return helpers.message(
        'Al menos un campo debe estar presente en el body',
      );
    }

    return true;
  })
  .messages({
    'object.unknown': 'El campo "{#key}" no está permitido',
    '*': 'Formato del body incorrecto',
  });

// ----------------------------
// PARAMS
// ----------------------------

export const get_params_userSchema = Joi.object({
  id: Joi.string().required().length(24).messages({
    'string.empty': 'El parámetro "id" no puede estar vacio',
    'string.length': 'El parámetro "id" debe ser un id válido',
    'any.required': 'El parámetro "id" es obligatorio',
    '*': 'Revisa el parámetro "id"',
  }),
});

// They are the same
export const put_params_userSchema = get_params_userSchema;
export const delete_params_userSchema = get_params_userSchema;
