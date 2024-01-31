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
