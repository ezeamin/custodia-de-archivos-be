import Joi from 'joi';
import {
  entriesRules,
  hourRules,
  pageRules,
  queryBooleanRules,
  queryRules,
  textRules,
  uuidRule,
} from '../validationRules/rules.js';

// ----------------------------
// BODY
// ----------------------------

// POST -----------------------------
export const post_notificationSchema = Joi.object({
  typeId: uuidRule('typeId')(),
  // receivers is a JSON that should be parsed
  receivers: Joi.array()
    .items(
      Joi.object({
        id: uuidRule('id')(),
        type: Joi.string().valid('user', 'area').required(),
      }),
    )
    .min(1)
    .required(),
  message: textRules('message', 1, 500)(),
  isResponse: Joi.boolean().required(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato incorrecto',
});

export const post_notificationTypeSchema = Joi.object({
  title: textRules('title', 1, 100)(),
  description: textRules('description', 1, 500)(),
  startHour: hourRules('startHour')(),
  endHour: hourRules('endHour')(),
  allowedRoles: Joi.array()
    .items(
      Joi.object({
        id: uuidRule('id')(),
        description: textRules('description', 1, 100)(),
      }).messages({
        'object.unknown':
          'El campo "{#key}" no está permitido en "allowedRoles"',
      }),
    )
    .min(1)
    .required(),
}).messages({
  'object.unknown': 'El campo "{#key}" no está permitido',
  '*': 'Formato incorrecto',
});

// PUT -----------------------------
export const put_notificationTypeSchema = post_notificationTypeSchema;

// ----------------------------
// PARAMS
// ----------------------------

export const get_params_notificationByIdSchema = Joi.object({
  notificationId: uuidRule('notificationId')(),
});

export const get_params_notificationAreaReceiversSchema = Joi.object({
  notificationId: uuidRule('notificationId')(),
  areaId: uuidRule('areaId')(),
});

export const get_params_notificationTypeByIdSchema = Joi.object({
  typeId: uuidRule('typeId')(),
});

export const put_params_notificationTypeSchema = Joi.object({
  typeId: uuidRule('typeId')(),
});

export const delete_params_notificationTypeSchema =
  put_params_notificationTypeSchema;

// ----------------------------
// QUERY
// ----------------------------

export const get_query_notificationsSchema = Joi.object({
  hasBeenRead: queryBooleanRules('hasBeenRead')(),
  sent: queryBooleanRules('sent')(),
  page: pageRules()(),
  entries: entriesRules()(),
  query: queryRules()(),
}).messages({
  'object.unknown': 'El query "{#key}" no está permitido',
  '*': 'Formato del query incorrecto',
});

export const get_query_notificationByIdSchema = Joi.object({
  sent: queryBooleanRules('sent')(),
}).messages({
  'object.unknown': 'El query "{#key}" no está permitido',
  '*': 'Formato del query incorrecto',
});

export const get_query_notificationTypesSchema = Joi.object({
  all: queryBooleanRules('all')(),
}).messages({
  'object.unknown': 'El query "{#key}" no está permitido',
  '*': 'Formato del query incorrecto',
});
