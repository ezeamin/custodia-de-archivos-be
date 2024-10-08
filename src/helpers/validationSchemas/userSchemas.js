import Joi from 'joi';

import {
  cuilRules,
  emailRules,
  entriesRules,
  pageRules,
  queryRules,
  textRules,
  uuidRule,
} from '../validationRules/rules.js';

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
  cuil: cuilRules('cuil')(),
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
  page: pageRules()(),
  entries: entriesRules()(),
  query: queryRules()(),
  role: Joi.string()
    .pattern(/^(ADMIN|EMPLOYEE|THIRD_PARTY)(,(ADMIN|EMPLOYEE|THIRD_PARTY))*$/)
    .messages({
      'string.base': 'El parámetro "role" debe ser un texto',
      'string.pattern.base':
        'El parámetro "role" debe ser "ADMIN", "EMPLOYEE" o "THIRD_PARTY"',
      '*': 'Revisa el parámetro "role"',
    }),
}).messages({
  'object.unknown': 'No se permiten parámetros adicionales',
  '*': 'Revisa los parámetros de la consulta',
});

export const get_query_loginLogsSchema = Joi.object({
  page: pageRules()(),
  entries: entriesRules()(),
  query: queryRules()(),
}).messages({
  'object.unknown': 'No se permiten parámetros adicionales',
  '*': 'Revisa los parámetros de la consulta',
});
