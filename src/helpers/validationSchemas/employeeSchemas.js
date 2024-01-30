import Joi from 'joi';

import { uuidRegex } from '../regex.js';
import {
  dateBeforeTodayRules,
  dniRules,
  emailRules,
  fileRules,
  numberRules,
  textRules,
  uuidRule,
} from './rules.js';

// ----------------------------
// BODY
// ----------------------------

export const post_employeeSchema = Joi.object({
  name: textRules('name', 3, 50),
  imgFile: fileRules('imgFile'),
  lastname: textRules('lastname', 3, 50),
  birthdate: dateBeforeTodayRules('birthdate'),
  startDate: dateBeforeTodayRules('startDate'),
  email: emailRules('email'),
  dni: dniRules('dni'),
  genderId: uuidRule('genderId'),
  areaId: uuidRule('areaId'),
  position: textRules('position', 3, 100),
  fileNumber: numberRules('fileNumber', 1, 1000000),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

// ----------------------------
// PARAMS
// ----------------------------

export const get_params_employeeByIdSchema = Joi.object({
  employeeId: Joi.string().required().length(36).regex(uuidRegex).messages({
    'string.empty': 'El parámetro "employeeId" no puede estar vacio',
    'string.length': 'El parámetro "employeeId" debe ser un uuid válido',
    'string.pattern.base': 'El parámetro "employeeId" debe ser un uuid válido',
    'any.required': 'El parámetro "employeeId" es obligatorio',
    '*': 'Revisa el parámetro "employeeId"',
  }),
});
export const get_params_employeeDocsSchema = get_params_employeeByIdSchema;
export const get_params_employeeHistorySchema = get_params_employeeByIdSchema;
export const get_params_employeeAbsencesSchema = get_params_employeeByIdSchema;
export const get_params_employeeLicensesSchema = get_params_employeeByIdSchema;
export const get_params_employeeVacationsSchema = get_params_employeeByIdSchema;
export const get_params_employeeTrainingsSchema = get_params_employeeByIdSchema;
export const get_params_employeeFormalWarningsSchema =
  get_params_employeeByIdSchema;
export const get_params_employeeExtraHoursSchema =
  get_params_employeeByIdSchema;
export const get_params_employeeLateArrivalsSchema =
  get_params_employeeByIdSchema;
export const get_params_employeeFamilySchema = get_params_employeeByIdSchema;
export const get_params_employeeFamilyMemberSchema = Joi.object({
  employeeId: Joi.string().required().length(36).regex(uuidRegex).messages({
    'string.empty': 'El parámetro "employeeId" no puede estar vacio',
    'string.length': 'El parámetro "employeeId" debe ser un uuid válido',
    'string.pattern.base': 'El parámetro "employeeId" debe ser un uuid válido',
    'any.required': 'El parámetro "employeeId" es obligatorio',
    '*': 'Revisa el parámetro "employeeId"',
  }),
  familyMemberId: Joi.string().required().length(36).regex(uuidRegex).messages({
    'string.empty': 'El parámetro "familyMemberId" no puede estar vacio',
    'string.length': 'El parámetro "familyMemberId" debe ser un uuid válido',
    'string.pattern.base':
      'El parámetro "familyMemberId" debe ser un uuid válido',
    'any.required': 'El parámetro "familyMemberId" es obligatorio',
    '*': 'Revisa el parámetro "familyMemberId"',
  }),
});
export const get_params_licensesTypesByIdSchema = Joi.object({
  licenseTypeId: Joi.string().required().length(36).regex(uuidRegex).messages({
    'string.empty': 'El parámetro "licenseTypeId" no puede estar vacio',
    'string.length': 'El parámetro "licenseTypeId" debe ser un uuid válido',
    'string.pattern.base':
      'El parámetro "licenseTypeId" debe ser un uuid válido',
    'any.required': 'El parámetro "licenseTypeId" es obligatorio',
    '*': 'Revisa el parámetro "licenseTypeId"',
  }),
});
export const get_params_trainingsTypesByIdSchema = Joi.object({
  trainingTypeId: Joi.string().required().length(36).regex(uuidRegex).messages({
    'string.empty': 'El parámetro "trainingTypeId" no puede estar vacio',
    'string.length': 'El parámetro "trainingTypeId" debe ser un uuid válido',
    'string.pattern.base':
      'El parámetro "trainingTypeId" debe ser un uuid válido',
    'any.required': 'El parámetro "trainingTypeId" es obligatorio',
    '*': 'Revisa el parámetro "trainingTypeId"',
  }),
});
