import Joi from 'joi';

import {
  dateBeforeTodayRules,
  dniRules,
  emailRules,
  numberRules,
  textRules,
  uuidRule,
} from './rules.js';

// ----------------------------
// BODY
// ----------------------------

export const post_employeeSchema = Joi.object({
  name: textRules('name', 3, 50)(),
  lastname: textRules('lastname', 3, 50)(),
  birthdate: dateBeforeTodayRules('birthdate')(),
  startDate: dateBeforeTodayRules('startDate')(),
  email: emailRules('email')(),
  dni: dniRules('dni')(),
  genderId: uuidRule('genderId')(),
  areaId: uuidRule('areaId')(),
  position: textRules('position', 3, 100)(),
  fileNumber: numberRules('fileNumber', 1, 1000000)(),
  force: Joi.boolean().default(false),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

// ----------------------------
// PARAMS
// ----------------------------

export const get_params_employeeByIdSchema = Joi.object({
  employeeId: uuidRule('employeeId')(),
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
  employeeId: uuidRule('employeeId')(),
  familyMemberId: uuidRule('familyMemberId')(),
});
export const get_params_licensesTypesByIdSchema = Joi.object({
  licenseTypeId: uuidRule('licenseTypeId')(),
});
export const get_params_trainingsTypesByIdSchema = Joi.object({
  trainingTypeId: uuidRule('trainingTypeId')(),
});
export const get_params_lifeInsuranceBeneficiarySchema = Joi.object({
  employeeId: uuidRule('employeeId')(),
  lifeInsuranceId: uuidRule('lifeInsuranceId')(),
  beneficiaryId: uuidRule('beneficiaryId')(),
});
