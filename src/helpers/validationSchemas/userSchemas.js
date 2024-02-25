import Joi from 'joi';

import { dniRules, emailRules, textRules, uuidRule } from './rules.js';

// ----------------------------
// BODY
// ----------------------------

export const post_userSchema = Joi.object({
  employeeId: uuidRule('employeeId')(),
}).messages({
  'object.unknown': 'No se permiten parámetros adicionales',
  '*': 'Revisa los parámetros del cuerpo',
});

export const post_readOnlyUserSchema = Joi.object({
  name: textRules('name', 3, 50)(),
  lastname: textRules('lastname', 3, 50)(),
  dni: dniRules('dni')(),
  description: textRules('description', 3, 100)(),
  email: emailRules('email')(),
}).messages({
  'object.unknown': 'No se permiten parámetros adicionales',
  '*': 'Revisa los parámetros del cuerpo',
});

// ----------------------------
// PARAMS
// ----------------------------

export const put_params_createAdminSchema = Joi.object({
  userId: uuidRule('userId')(),
}).messages({
  'object.unknown': 'No se permiten parámetros adicionales',
  '*': 'Revisa los parámetros de la consulta',
});
export const delete_params_deleteAdminSchema = put_params_createAdminSchema;
export const delete_params_deleteReadOnlySchema = put_params_createAdminSchema;

// ----------------------------
// QUERY
// ----------------------------

export const get_query_userSchema = Joi.object({
  page: Joi.number().integer().min(0).messages({
    'number.base': 'El parámetro "page" debe ser un número',
    'number.integer': 'El parámetro "page" debe ser un número entero',
    'number.min': 'El parámetro "page" no puede ser menor a 0',
    '*': 'Revisa el parámetro "page"',
  }),
  entries: Joi.number().integer().min(1).max(100).messages({
    'number.base': 'El parámetro "entries" debe ser un número',
    'number.integer': 'El parámetro "entries" debe ser un número entero',
    'number.min': 'El parámetro "entries" no puede ser menor a 1',
    'number.max': 'El parámetro "entries" no puede ser mayor a 100',
    '*': 'Revisa el parámetro "entries"',
  }),
  query: Joi.string().messages({
    'string.base': 'El parámetro "query" debe ser un texto',
    '*': 'Revisa el parámetro "query"',
  }),
  role: Joi.string().valid('ADMIN', 'EMPLOYEE', 'THIRD_PARTY').messages({
    'string.base': 'El parámetro "role" debe ser un texto',
    'any.only':
      'El parámetro "role" debe ser "ADMIN", "EMPLOYEE" o "THIRD_PARTY"',
    '*': 'Revisa el parámetro "role"',
  }),
}).messages({
  'object.unknown': 'No se permiten parámetros adicionales',
  '*': 'Revisa los parámetros de la consulta',
});

export const get_query_loginLogsSchema = Joi.object({
  page: Joi.number().integer().min(0).messages({
    'number.base': 'El parámetro "page" debe ser un número',
    'number.integer': 'El parámetro "page" debe ser un número entero',
    'number.min': 'El parámetro "page" no puede ser menor a 0',
    '*': 'Revisa el parámetro "page"',
  }),
  entries: Joi.number().integer().min(1).max(100).messages({
    'number.base': 'El parámetro "entries" debe ser un número',
    'number.integer': 'El parámetro "entries" debe ser un número entero',
    'number.min': 'El parámetro "entries" no puede ser menor a 1',
    'number.max': 'El parámetro "entries" no puede ser mayor a 100',
    '*': 'Revisa el parámetro "entries"',
  }),
  query: Joi.number().integer().positive().messages({
    'number.base': 'El parámetro "query" debe ser un número',
    'number.integer': 'El parámetro "query" debe ser un número entero',
    'number.positive': 'El parámetro "query" debe ser un número positivo',
    '*': 'Revisa el parámetro "query"',
  }),
}).messages({
  'object.unknown': 'No se permiten parámetros adicionales',
  '*': 'Revisa los parámetros de la consulta',
});
