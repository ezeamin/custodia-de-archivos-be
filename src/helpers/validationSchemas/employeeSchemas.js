import Joi from 'joi';

import {
  dateBeforeTodayRules,
  dniRules,
  emailRules,
  numberRules,
  phoneRules,
  textRules,
  typeRule,
  uuidRule,
} from './rules.js';

// ----------------------------
// BODY
// ----------------------------

// POST -----------------------------------------------------
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

export const post_employeeDocSchema = Joi.object({
  name: textRules('name', 3, 50)(),
  folderId: uuidRule('folderId')(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeDocFolderSchema = Joi.object({
  name: textRules('name', 3, 50)(),
  color: textRules('color', 6, 6)(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeAbsenceSchema = Joi.object({
  reason: textRules('reason', 3, 100)(),
  date: dateBeforeTodayRules('date')(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeLicenseSchema = Joi.object({
  observations: textRules('reason', 3, 100)(),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required().min(Joi.ref('fromDate')),
  typeId: uuidRule('typeId')(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeVacationSchema = Joi.object({
  observations: textRules('reason', 3, 100)(),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required().min(Joi.ref('fromDate')),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeTrainingSchema = Joi.object({
  observations: textRules('reason', 3, 100)(),
  typeId: uuidRule('typeId')(),
  reason: textRules('reason', 3, 100)(),
  date: Joi.date().required(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeFormalWarningSchema = Joi.object({
  reason: textRules('reason', 3, 100)(),
  date: Joi.date().required(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeLateArrivalSchema = Joi.object({
  date: dateBeforeTodayRules('date')(),
  hour: Joi.string()
    .required()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  observations: textRules('observations', 3, 100)(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeExtraHourSchema = Joi.object({
  date: Joi.date().required(),
  hours: numberRules('hours', 1, 24)(),
  observations: textRules('observations', 3, 100)(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_licenseTypeSchema = Joi.object({
  title: textRules('title', 3, 50)(),
  description: textRules('description', 3, 100)(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_trainingTypeSchema = Joi.object({
  title: textRules('title', 3, 50)(),
  description: textRules('description', 3, 100)(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeFamilyMemberSchema = Joi.object({
  name: textRules('name', 3, 50)(),
  lastname: textRules('lastname', 3, 50)(),
  dni: dniRules('dni')(),
  birthdate: dateBeforeTodayRules('birthdate')(),
  relationshipId: uuidRule('relationshipId')(),
  genderId: uuidRule('genderId')(),
  street: typeRule('street')(),
  locality: typeRule('locality')(),
  state: typeRule('state')(),
  streetNumber: numberRules('streetNumber', 1, 10000)(),
  apt: textRules('apt', 1, 10)(),
  phone: phoneRules('phone')(),
  force: Joi.boolean().default(false),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_employeeLifeInsuranceSchema = Joi.object({
  name: textRules('name', 3, 50)(),
  policyNumber: textRules('policyNumber', 3, 50)(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

export const post_lifeInsuranceBeneficiarySchema = Joi.object({
  name: textRules('name', 3, 50)(),
  lastname: textRules('lastname', 3, 50)(),
  dni: dniRules('dni')(),
  birthdate: dateBeforeTodayRules('birthdate')(),
  relationshipId: uuidRule('relationshipId')(),
  genderId: uuidRule('genderId')(),
  street: typeRule('street')(),
  locality: typeRule('locality')(),
  state: typeRule('state')(),
  streetNumber: numberRules('streetNumber', 1, 10000)(),
  apt: textRules('apt', 1, 10)(),
  percentage: numberRules('percentage', 1, 100)(),
  force: Joi.boolean().default(false),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato del body incorrecto',
});

// PUT ------------------------------------------------------

// ----------------------------
// PARAMS
// ----------------------------

// GET -----------------------------------------------------
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

// POST -----------------------------------------------------
export const post_params_employeeDocSchema = get_params_employeeByIdSchema;
export const post_params_employeeDocFolderSchema =
  get_params_employeeByIdSchema;
export const post_params_employeeAbsenceSchema = get_params_employeeByIdSchema;
export const post_params_employeeLicenseSchema = get_params_employeeByIdSchema;
export const post_params_employeeVacationSchema = get_params_employeeByIdSchema;
export const post_params_employeeTrainingSchema = get_params_employeeByIdSchema;
export const post_params_employeeFormalWarningSchema =
  get_params_employeeByIdSchema;
export const post_params_employeeLateArrivalSchema =
  get_params_employeeByIdSchema;
export const post_params_employeeExtraHourSchema =
  get_params_employeeByIdSchema;
export const post_params_employeeFamilyMemberSchema =
  get_params_employeeByIdSchema;
export const post_params_employeeLifeInsuranceSchema =
  get_params_employeeByIdSchema;
export const post_params_lifeInsuranceBeneficiarySchema = Joi.object({
  employeeId: uuidRule('employeeId')(),
  lifeInsuranceId: uuidRule('lifeInsuranceId')(),
});

// PUT ------------------------------------------------------

// DELETE ---------------------------------------------------
