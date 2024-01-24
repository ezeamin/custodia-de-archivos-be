import Joi from 'joi';
import { passwordRules, usernameRules } from '../validationRules/rules.js';

// ----------------------------
// BODY
// ----------------------------

export const post_loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_recoverPasswordSchema = Joi.object({
  username: usernameRules(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_resetPasswordSchema = Joi.object({
  password: passwordRules(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});
