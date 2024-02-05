import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { isAdminOrReadOnly } from '../../middlewares/isAdminOrReadOnly.js';

import { Employees } from '../../controllers/employees/index.js';
import { ENDPOINTS } from '../endpoints.js';

import { upload } from '../../helpers/multer.js';

import { validateParams } from '../../middlewares/validateParams.js';
import {
  get_params_employeeAbsencesSchema,
  get_params_employeeByIdSchema,
  get_params_employeeDocsSchema,
  get_params_employeeExtraHoursSchema,
  get_params_employeeFamilyMemberSchema,
  get_params_employeeFormalWarningsSchema,
  get_params_employeeHistorySchema,
  get_params_employeeLateArrivalsSchema,
  get_params_employeeLicensesSchema,
  get_params_employeeTrainingsSchema,
  get_params_employeeVacationsSchema,
  get_params_licensesTypesByIdSchema,
  get_params_trainingsTypesByIdSchema,
  post_employeeSchema,
} from '../../helpers/validationSchemas/employeeSchemas.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { validateFile } from '../../middlewares/validateFile.js';

export const employeeRouter = express.Router();

// GET ---------------------------
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEES,
  isAuthenticated,
  isAdminOrReadOnly,
  Employees.GetController.employees,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeByIdSchema),
  Employees.GetController.employeeById,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_DOCS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeDocsSchema),
  Employees.GetController.employeeDocs,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_HISTORY,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeHistorySchema),

  Employees.GetController.employeeHistory,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_ABSENCES,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeAbsencesSchema),

  Employees.GetController.employeeAbsences,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_LICENSES,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeLicensesSchema),

  Employees.GetController.employeeLicenses,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_VACATIONS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeVacationsSchema),

  Employees.GetController.employeeVacations,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_TRAININGS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeTrainingsSchema),

  Employees.GetController.employeeTrainings,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FORMAL_WARNINGS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeFormalWarningsSchema),

  Employees.GetController.employeeFormalWarnings,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_EXTRA_HOURS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeExtraHoursSchema),

  Employees.GetController.employeeLateArrivals,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_LATE_ARRIVALS,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeLateArrivalsSchema),

  Employees.GetController.employeeExtraHours,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  isAdmin,
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeFamilyMemberSchema),
  Employees.GetController.employeeFamilyMember,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_LICENSES_TYPES,
  isAuthenticated,
  isAdminOrReadOnly,
  Employees.GetController.licensesTypes,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_LICENSE_TYPE,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_licensesTypesByIdSchema),
  Employees.GetController.licensesTypesById,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPES,
  isAuthenticated,
  isAdminOrReadOnly,
  Employees.GetController.trainingsTypes,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPE,
  isAuthenticated,
  isAdminOrReadOnly,
  (req, res, next) =>
    validateParams(req, res, next, get_params_trainingsTypesByIdSchema),
  Employees.GetController.trainingsTypesById,
);

// POST ---------------------------
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE,
  isAuthenticated,
  isAdmin,
  upload.single('imgFile'),
  (req, res, next) => validateFile(req, res, next),
  (req, res, next) => validateBody(req, res, next, post_employeeSchema),
  Employees.PostController.createEmployee,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_DOC,
  isAuthenticated,
  isAdmin,
  upload.single('file'),
  (req, res, next) => validateFile(req, res, next),
  Employees.PostController.createEmployeeDoc,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_ABSENCE,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createEmployeeAbsence,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LICENSE,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createEmployeeLicense,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_VACATION,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createEmployeeVacation,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_TRAINING,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createEmployeeTraining,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FORMAL_WARNING,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createEmployeeFormalWarning,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LATE_ARRIVAL,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createEmployeeLateArrival,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_EXTRA_HOUR,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createEmployeeExtraHour,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createFamilyMember,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_LICENSE_TYPE,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createLicenseType,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_TRAINING_TYPE,
  isAuthenticated,
  isAdmin,
  Employees.PostController.createTrainingType,
);

// PUT ----------------------------
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE,
  isAuthenticated,
  isAdmin,
  Employees.PutController.updateEmployee,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_IMAGE,
  isAuthenticated,
  isAdmin,
  upload.single('imgFile'),
  (req, res, next) => validateFile(req, res, next),
  Employees.PutController.updateEmployeeImage,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_DOC,
  isAuthenticated,
  isAdmin,
  Employees.PutController.updateEmployeeDoc,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  isAdmin,
  Employees.PutController.updateEmployeeFamilyMember,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_LICENSE_TYPE,
  isAuthenticated,
  isAdmin,
  Employees.PutController.updateLicenseType,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_TRAINING_TYPE,
  isAuthenticated,
  isAdmin,
  Employees.PutController.updateTrainingType,
);

// DELETE -------------------------
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployee,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_DOC,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeDoc,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_ABSENCE,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeAbsence,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_TRAINING,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeTraining,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FORMAL_WARNING,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeFormalWarning,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_EXTRA_HOUR,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeExtraHour,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LATE_ARRIVAL,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeLateArrival,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LICENSE,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeLicense,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_VACATION,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeVacation,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteEmployeeFamilyMember,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_LICENSE_TYPE,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteLicenseType,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_TRAINING_TYPE,
  isAuthenticated,
  isAdmin,
  Employees.DeleteController.deleteTrainingType,
);
