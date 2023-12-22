import Joi from 'joi';

// ----------------------------
// BODY
// ----------------------------

export const post_productSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(30).messages({
    'string.empty': 'El campo "name" no puede estar vacio',
    'string.min': 'El campo "name" debe tener al menos 3 caracteres',
    'string.max': 'El campo "name" debe tener maximo 30 caracteres',
    'any.required': 'El campo "name" es obligatorio',
    '*': 'Revisa el campo "name"',
  }),
  price: Joi.number().required().min(1).max(1000000).messages({
    'number.empty': 'El campo "price" no puede estar vacio',
    'number.min': 'El campo "price" debe ser mayor a 0',
    'number.max': 'El campo "price" debe ser menor a 1000000',
    'any.required': 'El campo "price" es obligatorio',
    '*': 'Revisa el campo "price"',
  }),
  description: Joi.string().required().trim().min(3).max(100).messages({
    'string.empty': 'El campo "description" no puede estar vacio',
    'string.min': 'El campo "description" debe tener al menos 3 caracteres',
    'string.max': 'El campo "description" debe tener maximo 100 caracteres',
    'any.required': 'El campo "description" es obligatorio',
    '*': 'Revisa el campo "description"',
  }),
  image: Joi.string().required().trim().min(5).max(1000).uri().messages({
    'string.empty': 'El campo "image" no puede estar vacio',
    'string.min': 'El campo "image" debe tener al menos 5 caracteres',
    'string.max': 'El campo "image" debe tener maximo 1000 caracteres',
    'string.uri': 'El campo "image" debe ser una URL valida',
    'any.required': 'El campo "image" es obligatorio',
    '*': 'Revisa el campo "image"',
  }),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

// copy post validation but remove "required" option
export const put_productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).messages({
    'string.empty': 'El campo "name" no puede estar vacio',
    'string.min': 'El campo "name" debe tener al menos 3 caracteres',
    'string.max': 'El campo "name" debe tener maximo 30 caracteres',
    '*': 'Revisa el campo "name"',
  }),
  price: Joi.number().min(1).max(1000000).messages({
    'number.empty': 'El campo "price" no puede estar vacio',
    'number.min': 'El campo "price" debe ser mayor a 0',
    'number.max': 'El campo "price" debe ser menor a 1000000',
    '*': 'Revisa el campo "price"',
  }),
  description: Joi.string().trim().min(3).max(100).messages({
    'string.empty': 'El campo "description" no puede estar vacio',
    'string.min': 'El campo "description" debe tener al menos 3 caracteres',
    'string.max': 'El campo "description" debe tener maximo 100 caracteres',
    '*': 'Revisa el campo "description"',
  }),
  image: Joi.string().trim().min(5).max(1000).uri().messages({
    'string.empty': 'El campo "image" no puede estar vacio',
    'string.min': 'El campo "image" debe tener al menos 5 caracteres',
    'string.max': 'El campo "image" debe tener maximo 1000 caracteres',
    'string.uri': 'El campo "image" debe ser una URL valida',
    '*': 'Revisa el campo "image"',
  }),
})
  .custom((value, helpers) => {
    // At least one field
    const { name, price, description, image } = value;

    if (!name && !price && !description && !image) {
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

export const get_params_productSchema = Joi.object({
  id: Joi.string().required().length(24).messages({
    'string.empty': 'El parámetro "id" no puede estar vacio',
    'string.length': 'El parámetro "id" debe ser un id válido',
    'any.required': 'El parámetro "id" es obligatorio',
    '*': 'Revisa el parámetro "id"',
  }),
});

// They are the same
export const put_params_productSchema = get_params_productSchema;
export const delete_params_productSchema = get_params_productSchema;
