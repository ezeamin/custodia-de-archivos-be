import Joi from 'joi';
import { uuidRegex } from '../regex.js';

export const uuidRule = (name) => {
  return () =>
    Joi.string()
      .required()
      .length(36)
      .regex(uuidRegex)
      .messages({
        'string.empty': `El campo "${name}" no puede estar vacio`,
        'string.length': `El campo "${name}" debe ser un uuid válido`,
        'string.pattern.base': `El campo "${name}" debe ser un uuid válido`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo ${name}`,
      });
};

export const textRules = (name, min, max) => {
  return () =>
    Joi.string()
      .required()
      .trim()
      .min(min)
      .max(max)
      .messages({
        'string.empty': `El campo "${name}" no puede estar vacio`,
        'string.min': `El campo "${name}" debe tener al menos ${min} caracteres`,
        'string.max': `El campo "${name}" debe tener como máximo ${max} caracteres`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo ${name}`,
      });
};

export const dateBeforeTodayRules = (name) => {
  return () =>
    Joi.date()
      .required()
      .less(new Date())
      .messages({
        'date.base': `El campo "${name}" debe ser una fecha válida`,
        'date.less': `El campo "${name}" debe ser una fecha anterior a la actual`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo "${name}"`,
      });
};

export const emailRules = (name = 'email') => {
  return () =>
    Joi.string()
      .required()
      .trim()
      .email({ tlds: { allow: false } })
      .messages({
        'string.empty': `El campo "${name}" no puede estar vacio`,
        'string.email': `El campo "${name}" debe ser un email válido`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo "${name}"`,
      });
};

export const dniRules = (name = 'dni') => {
  return () =>
    Joi.string()
      .trim()
      .required()
      .length(8)
      .regex(/^[0-9]+$/)
      .messages({
        'string.empty': `El campo "${name}" no puede estar vacio`,
        'string.length': `El campo "${name}" debe tener 8 caracteres`,
        'string.pattern.base': `El campo "${name}" debe ser un dni válido`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo "${name}"`,
      });
};

export const fileRules = (name = 'file') => {
  return () =>
    Joi.any()
      .required()
      .messages({
        'any.required': `El campo "${name}" es obligatorio`,
        'any.only': `El campo "${name}" debe ser un archivo`,
      });
};

export const numberRules = (name, min = -9999999999, max = 9999999999) => {
  return () =>
    Joi.number()
      .required()
      .min(min)
      .max(max)
      .messages({
        'number.base': `El campo "${name}" debe ser un número`,
        'number.min': `El campo "${name}" debe ser mayor a ${min}`,
        'number.max': `El campo "${name}" debe ser menor a ${max}`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo "${name}"`,
      });
};

export const typeRule = (name) => {
  return () =>
    Joi.object({
      id: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
          'string.empty': `El campo "id" de "${name}" no puede estar vacio`,
          'string.min': `El campo "id" de "${name}" debe tener al menos 1 caracter`,
          'any.required': `El campo "id" de "${name}" es obligatorio`,
          '*': `Revisa el campo "id" de "${name}"`,
        }),
      description: textRules(`"description" de "${name}"`, 3, 100)(),
    }).messages({
      'object.unknown': `El campo "{#key}" en "${name}" no está permitido`,
      '*': `Formato de "${name}" incorrecto`,
    });
};

export const phoneRules = (name = 'phone') => {
  return () =>
    Joi.string()
      .trim()
      .required()
      .min(9)
      .max(14)
      .regex(/^[0-9]+$/)
      .messages({
        'string.empty': `El campo "${name}" no puede estar vacio`,
        'string.length': `El campo "${name}" debe tener 10 caracteres`,
        'string.pattern.base': `El campo "${name}" debe ser un teléfono válido`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo "${name}"`,
      });
};

export const hourRules = (name) => {
  return () =>
    Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'hour')
      .messages({
        'string.pattern.base': `El campo "${name}" debe ser una hora válida`,
        'any.required': `El campo "${name}" es obligatorio`,
        '*': `Revisa el campo "${name}"`,
      });
};

// ----------------------------
// QUERY
// ----------------------------

export const queryBooleanRules = (name) => {
  return () =>
    Joi.string()
      .valid('true', 'false')
      .messages({
        'string.base': `El query "${name}" debe ser de tipo "string"`,
        'string.empty': `El query "${name}" no puede estar vacío`,
        'any.required': `El query "${name}" es requerido`,
        'any.only': `El query "${name}" debe ser "true" o "false"`,
      });
};

export const pageRules = () => {
  return () =>
    Joi.number().min(0).max(1000).messages({
      'number.base': `El query "page" debe ser de tipo "number"`,
      'number.empty': `El query "page" no puede estar vacío`,
      'number.min': `El query "page" debe ser mayor a 0`,
      'number.max': `El query "page" debe ser menor a 1000`,
    });
};

export const entriesRules = () => {
  return () =>
    Joi.number().min(1).max(100).messages({
      'number.base': `El query "entries" debe ser de tipo "number"`,
      'number.empty': `El query "entries" no puede estar vacío`,
      'number.min': `El query "entries" debe ser mayor a 0`,
      'number.max': `El query "entries" debe ser menor a 100`,
    });
};

export const queryRules = () => {
  return () =>
    Joi.string().trim().max(100).messages({
      'string.base': `El query "query" debe ser de tipo "string"`,
      'string.empty': `El query "query" no puede estar vacío`,
      'string.max': `El query "query" debe tener como máximo 100 caracteres`,
    });
};
