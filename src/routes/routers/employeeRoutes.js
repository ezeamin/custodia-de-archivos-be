import express from 'express';

import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { checkRole } from '../../middlewares/checkRole.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { validateFile } from '../../middlewares/validateFile.js';
import { validateParams } from '../../middlewares/validateParams.js';
import { validateQuery } from '../../middlewares/validateQuery.js';

import { roles } from '../../constants/roles.js';

import { Employees } from '../../controllers/employees/index.js';
import { ENDPOINTS } from '../endpoints.js';

import { upload } from '../../helpers/multer.js';

import {
  delete_params_employeeAbsenceSchema,
  delete_params_employeeDocFolderSchema,
  delete_params_employeeDocSchema,
  delete_params_employeeExtraHourSchema,
  delete_params_employeeFamilyMemberSchema,
  delete_params_employeeFormalWarningSchema,
  delete_params_employeeLateArrivalSchema,
  delete_params_employeeLicenseSchema,
  delete_params_employeeLifeInsuranceSchema,
  delete_params_employeeSchema,
  delete_params_employeeTrainingSchema,
  delete_params_employeeVacationSchema,
  delete_params_licenseTypeSchema,
  delete_params_lifeInsuranceBeneficiarySchema,
  delete_params_trainingTypeSchema,
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
  get_query_employeeHistorySchema,
  get_query_employeesSchema,
  post_employeeAbsenceSchema,
  post_employeeDocFolderSchema,
  post_employeeDocSchema,
  post_employeeExtraHourSchema,
  post_employeeFamilyMemberSchema,
  post_employeeFormalWarningSchema,
  post_employeeLateArrivalSchema,
  post_employeeLicenseSchema,
  post_employeeLifeInsuranceSchema,
  post_employeeSchema,
  post_employeeTrainingSchema,
  post_employeeVacationSchema,
  post_licenseTypeSchema,
  post_lifeInsuranceBeneficiarySchema,
  post_params_employeeAbsenceSchema,
  post_params_employeeDocFolderSchema,
  post_params_employeeDocSchema,
  post_params_employeeExtraHourSchema,
  post_params_employeeFamilyMemberSchema,
  post_params_employeeFormalWarningSchema,
  post_params_employeeLateArrivalSchema,
  post_params_employeeLicenseSchema,
  post_params_employeeLifeInsuranceSchema,
  post_params_employeeTrainingSchema,
  post_params_employeeVacationSchema,
  post_params_lifeInsuranceBeneficiarySchema,
  post_trainingTypeSchema,
  put_employeeDocFolderSchema,
  put_employeeDocSchema,
  put_employeeFamilyMemberSchema,
  put_employeeImageSchema,
  put_employeeLifeInsuranceSchema,
  put_employeeSchema,
  put_licenseTypeSchema,
  put_lifeInsuranceBeneficiarySchema,
  put_params_employeeDocFolderSchema,
  put_params_employeeDocSchema,
  put_params_employeeFamilyMemberSchema,
  put_params_employeeImageSchema,
  put_params_employeeLifeInsuranceSchema,
  put_params_employeeSchema,
  put_params_licenseTypeSchema,
  put_params_lifeInsuranceBeneficiarySchema,
  put_params_trainingTypeSchema,
  put_trainingTypeSchema,
} from '../../helpers/validationSchemas/employeeSchemas.js';

export const employeeRouter = express.Router();

// GET ---------------------------
employeeRouter.get(
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEES,
  isAuthenticated,
  (req, res, next) =>
    checkRole(req, res, next, [roles.ADMIN, roles.THIRD_PARTY, roles.AREA]),
  (req, res, next) => validateQuery(req, res, next, get_query_employeesSchema),
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
  (req, res, next) =>
    validateQuery(req, res, next, get_query_employeeHistorySchema),
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
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeDocSchema),
  (req, res, next) => validateFile(req, res, next),
  (req, res, next) => validateBody(req, res, next, post_employeeDocSchema),
  Employees.PostController.createEmployeeDoc,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FOLDER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeDocFolderSchema),
  (req, res, next) =>
    validateBody(req, res, next, post_employeeDocFolderSchema),
  Employees.PostController.createEmployeeFolder,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_ABSENCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeAbsenceSchema),
  (req, res, next) => validateBody(req, res, next, post_employeeAbsenceSchema),
  Employees.PostController.createEmployeeAbsence,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LICENSE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeLicenseSchema),
  (req, res, next) => validateBody(req, res, next, post_employeeLicenseSchema),
  Employees.PostController.createEmployeeLicense,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_VACATION,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeVacationSchema),
  (req, res, next) => validateBody(req, res, next, post_employeeVacationSchema),
  Employees.PostController.createEmployeeVacation,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_TRAINING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeTrainingSchema),
  (req, res, next) => validateBody(req, res, next, post_employeeTrainingSchema),
  Employees.PostController.createEmployeeTraining,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FORMAL_WARNING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeFormalWarningSchema),
  (req, res, next) =>
    validateBody(req, res, next, post_employeeFormalWarningSchema),
  Employees.PostController.createEmployeeFormalWarning,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LATE_ARRIVAL,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeLateArrivalSchema),
  (req, res, next) =>
    validateBody(req, res, next, post_employeeLateArrivalSchema),
  Employees.PostController.createEmployeeLateArrival,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_EXTRA_HOUR,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeExtraHourSchema),
  (req, res, next) =>
    validateBody(req, res, next, post_employeeExtraHourSchema),
  Employees.PostController.createEmployeeExtraHour,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeFamilyMemberSchema),
  (req, res, next) =>
    validateBody(req, res, next, post_employeeFamilyMemberSchema),
  Employees.PostController.createFamilyMember,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_EMPLOYEE_LIFE_INSURANCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_employeeLifeInsuranceSchema),
  (req, res, next) =>
    validateBody(req, res, next, post_employeeLifeInsuranceSchema),
  Employees.PostController.createEmployeeLifeInsurance,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_LIFE_INSURANCE_BENEFICIARY,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, post_params_lifeInsuranceBeneficiarySchema),
  (req, res, next) =>
    validateBody(req, res, next, post_lifeInsuranceBeneficiarySchema),
  Employees.PostController.createLifeInsuranceBeneficiary,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_LICENSE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) => validateBody(req, res, next, post_licenseTypeSchema),
  Employees.PostController.createLicenseType,
);
employeeRouter.post(
  ENDPOINTS.EMPLOYEES.POST_TRAINING_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) => validateBody(req, res, next, post_trainingTypeSchema),
  Employees.PostController.createTrainingType,
);

// PUT ----------------------------
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) => validateParams(req, res, next, put_params_employeeSchema),
  (req, res, next) => validateBody(req, res, next, put_employeeSchema),
  Employees.PutController.updateEmployee,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_IMAGE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  upload.single('imgFile'),
  (req, res, next) =>
    validateParams(req, res, next, put_params_employeeImageSchema),
  (req, res, next) => validateBody(req, res, next, put_employeeImageSchema),
  (req, res, next) => validateFile(req, res, next),
  Employees.PutController.updateEmployeeImage,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_DOC,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_employeeDocSchema),
  (req, res, next) => validateBody(req, res, next, put_employeeDocSchema),
  Employees.PutController.updateEmployeeDoc,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_FOLDER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_employeeDocFolderSchema),
  (req, res, next) => validateBody(req, res, next, put_employeeDocFolderSchema),
  Employees.PutController.updateEmployeeFolder,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_employeeFamilyMemberSchema),
  (req, res, next) =>
    validateBody(req, res, next, put_employeeFamilyMemberSchema),
  Employees.PutController.updateEmployeeFamilyMember,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_EMPLOYEE_LIFE_INSURANCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_employeeLifeInsuranceSchema),
  (req, res, next) =>
    validateBody(req, res, next, put_employeeLifeInsuranceSchema),
  Employees.PutController.updateEmployeeLifeInsurance,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_LIFE_INSURANCE_BENEFICIARY,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_lifeInsuranceBeneficiarySchema),
  (req, res, next) =>
    validateBody(req, res, next, put_lifeInsuranceBeneficiarySchema),
  Employees.PutController.updateLifeInsuranceBeneficiary,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_LICENSE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_licenseTypeSchema),
  (req, res, next) => validateBody(req, res, next, put_licenseTypeSchema),
  Employees.PutController.updateLicenseType,
);
employeeRouter.put(
  ENDPOINTS.EMPLOYEES.PUT_TRAINING_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, put_params_trainingTypeSchema),
  (req, res, next) => validateBody(req, res, next, put_trainingTypeSchema),
  Employees.PutController.updateTrainingType,
);

// DELETE -------------------------
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeSchema),
  Employees.DeleteController.deleteEmployee,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_DOC,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeDocSchema),
  Employees.DeleteController.deleteEmployeeDoc,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FOLDER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeDocFolderSchema),
  Employees.DeleteController.deleteEmployeeFolder,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_ABSENCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeAbsenceSchema),
  Employees.DeleteController.deleteEmployeeAbsence,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_TRAINING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeTrainingSchema),
  Employees.DeleteController.deleteEmployeeTraining,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FORMAL_WARNING,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeFormalWarningSchema),
  Employees.DeleteController.deleteEmployeeFormalWarning,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_EXTRA_HOUR,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeExtraHourSchema),
  Employees.DeleteController.deleteEmployeeExtraHour,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LATE_ARRIVAL,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeLateArrivalSchema),
  Employees.DeleteController.deleteEmployeeLateArrival,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LICENSE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeLicenseSchema),
  Employees.DeleteController.deleteEmployeeLicense,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_VACATION,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeVacationSchema),
  Employees.DeleteController.deleteEmployeeVacation,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_FAMILY_MEMBER,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeFamilyMemberSchema),
  Employees.DeleteController.deleteEmployeeFamilyMember,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_EMPLOYEE_LIFE_INSURANCE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_employeeLifeInsuranceSchema),
  Employees.DeleteController.deleteEmployeeLifeInsurance,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_LIFE_INSURANCE_BENEFICIARY,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(
      req,
      res,
      next,
      delete_params_lifeInsuranceBeneficiarySchema,
    ),
  Employees.DeleteController.deleteEmployeeLifeInsuranceBeneficiary,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_LICENSE_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_licenseTypeSchema),
  Employees.DeleteController.deleteLicenseType,
);
employeeRouter.delete(
  ENDPOINTS.EMPLOYEES.DELETE_TRAINING_TYPE,
  isAuthenticated,
  (req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.AREA]),
  (req, res, next) =>
    validateParams(req, res, next, delete_params_trainingTypeSchema),
  Employees.DeleteController.deleteTrainingType,
);
