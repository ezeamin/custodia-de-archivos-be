import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { checkRole } from '../../middlewares/checkRole.js';
import { validateParams } from '../../middlewares/validateParams.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { validateFile } from '../../middlewares/validateFile.js';

import { roles } from '../../constants/roles.js';

import { Employees } from '../../controllers/employees/index.js';
import { ENDPOINTS } from '../endpoints.js';

import { upload } from '../../helpers/multer.js';

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
  get_params_lifeInsuranceBeneficiarySchema,
  get_params_trainingsTypesByIdSchema,
  post_employeeSchema,
} from '../../helpers/validationSchemas/employeeSchemas.js';

export const employeeRouter = express.Router();

// GET ---------------------------
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEES,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  Employees.GetController.employees,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEES_REPORT,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  Employees.GetController.employeesReport,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeByIdSchema),
  Employees.GetController.employeeById,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_DOCS,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeDocsSchema),
  Employees.GetController.employeeDocs,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_HISTORY,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeHistorySchema),

  Employees.GetController.employeeHistory,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_ABSENCES,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeAbsencesSchema),

  Employees.GetController.employeeAbsences,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_LICENSES,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeLicensesSchema),

  Employees.GetController.employeeLicenses,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_VACATIONS,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeVacationsSchema),

  Employees.GetController.employeeVacations,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_TRAININGS,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeTrainingsSchema),

  Employees.GetController.employeeTrainings,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FORMAL_WARNINGS,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeFormalWarningsSchema),

  Employees.GetController.employeeFormalWarnings,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_EXTRA_HOURS,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeExtraHoursSchema),

  Employees.GetController.employeeLateArrivals,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_LATE_ARRIVALS,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeLateArrivalsSchema),

  Employees.GetController.employeeExtraHours,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_employeeFamilyMemberSchema),
  Employees.GetController.employeeFamilyMember,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_LIFE_INSURANCE_BENEFICIARY,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_lifeInsuranceBeneficiarySchema),
  Employees.GetController.lifeInsuranceBeneficiaryById,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_LICENSES_TYPES,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  Employees.GetController.licensesTypes,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_LICENSE_TYPE,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_licensesTypesByIdSchema),
  Employees.GetController.licensesTypesById,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPES,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  Employees.GetController.trainingsTypes,
);
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPE,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, get_params_trainingsTypesByIdSchema),
  Employees.GetController.trainingsTypesById,
);

// POST ---------------------------
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  upload.single('imgFile'),
  (req, res, next) => validateFile(req, res, next),
  (req, res, next) => validateBody(req, res, next, post_employeeSchema),
  Employees.PostController.createEmployee,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_DOC,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  upload.single('file'),
  (req, res, next) => validateFile(req, res, next),
  Employees.PostController.createEmployeeDoc,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FOLDER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeFolder,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_ABSENCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeAbsence,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LICENSE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeLicense,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_VACATION,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeVacation,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_TRAINING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeTraining,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FORMAL_WARNING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeFormalWarning,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LATE_ARRIVAL,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeLateArrival,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_EXTRA_HOUR,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeExtraHour,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createFamilyMember,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LIFE_INSURANCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createEmployeeLifeInsurance,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_LIFE_INSURANCE_BENEFICIARY,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createLifeInsuranceBeneficiary,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_LICENSE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createLicenseType,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_TRAINING_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PostController.createTrainingType,
);

// PUT ----------------------------
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateEmployee,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_IMAGE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  upload.single('imgFile'),
  (req, res, next) => validateFile(req, res, next),
  Employees.PutController.updateEmployeeImage,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_DOC,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateEmployeeDoc,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_FOLDER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateEmployeeFolder,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateEmployeeFamilyMember,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_LIFE_INSURANCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateEmployeeLifeInsurance,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_LIFE_INSURANCE_BENEFICIARY,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateLifeInsuranceBeneficiary,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_LICENSE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateLicenseType,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_TRAINING_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.PutController.updateTrainingType,
);

// DELETE -------------------------
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployee,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_DOC,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeDoc,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FOLDER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeFolder,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_ABSENCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeAbsence,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_TRAINING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeTraining,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FORMAL_WARNING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeFormalWarning,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_EXTRA_HOUR,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeExtraHour,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LATE_ARRIVAL,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeLateArrival,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LICENSE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeLicense,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_VACATION,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeVacation,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeFamilyMember,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LIFE_INSURANCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeLifeInsurance,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_LIFE_INSURANCE_BENEFICIARY,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteEmployeeLifeInsuranceBeneficiary,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_LICENSE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteLicenseType,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_TRAINING_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  Employees.DeleteController.deleteTrainingType,
);
