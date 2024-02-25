import Joi from 'joi';
import { emailRules, queryBooleanRules, textRules, uuidRule } from './rules.js';

// ----------------------------
// BODY
// ----------------------------

// POST -----------------------------
export const post_areaSchema = Joi.object({
  title: textRules('title', 3, 50)(),
  responsibleEmail: emailRules('responsibleEmail')(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

// PUT -----------------------------
export const put_areaSchema = Joi.object({
  title: textRules('title', 3, 50)(),
  responsibleEmail: emailRules('responsibleEmail')(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

// ----------------------------
// PARAMS
// ----------------------------

export const get_params_areaSchema = Joi.object({
  areaId: uuidRule('areaId')(),
}).messages({
  'object.unknown': 'El parámetro "{#key}" no está permitido',
  '*': 'Formato del parámetro incorrecto',
});

export const put_params_areaSchema = get_params_areaSchema;
export const delete_params_areaSchema = get_params_areaSchema;

// ----------------------------
// QUERY
// ----------------------------

export const get_query_rolesSchema = Joi.object({
  notifications: queryBooleanRules('notifications')(),
}).messages({
  'object.unknown': 'El query "{#key}" no está permitido',
  '*': 'Formato del query incorrecto',
});

export const get_query_areasSchema = Joi.object({
  filterAssignable: queryBooleanRules('filterAssignable')(),
}).messages({
  'object.unknown': 'El query "{#key}" no está permitido',
  '*': 'Formato del query incorrecto',
});
