export const ENDPOINTS = {
  AUTH: {
    ROOT: '/auth',
    POST_LOGIN: '/login',
    POST_REFRESH_TOKEN: '/refresh-token',
    POST_LOGOUT: '/logout',
    POST_RECOVER_PASSWORD: '/recover-password',
    PUT_RESET_PASSWORD: '/reset-password',
  },
  EMPLOYEES: {
    ROOT: '/employees',
    GET_EMPLOYEES: '/',
    GET_EMPLOYEE: '/:employeeId',
    GET_EMPLOYEE_DOCS: '/:employeeId/docs',
    GET_EMPLOYEE_HISTORY: '/:employeeId/history',
    GET_EMPLOYEE_ABSENCES: '/:employeeId/absences',
    GET_EMPLOYEE_LICENSES: '/:employeeId/licenses',
    GET_EMPLOYEE_VACATIONS: '/:employeeId/vacations',
    GET_EMPLOYEE_TRAININGS: '/:employeeId/trainings',
    GET_EMPLOYEE_FORMAL_WARNINGS: '/:employeeId/formal-warnings',
    GET_EMPLOYEE_EXTRA_HOURS: '/:employeeId/extra-hours',
    GET_EMPLOYEE_LATE_ARRIVALS: '/:employeeId/late-arrivals',
    GET_EMPLOYEE_FAMILY_MEMBER: '/:employeeId/family/:familyMemberId',
    GET_LICENSES_TYPES: '/licenses/types',
    GET_LICENSE_TYPE: '/licenses/types/:licenseTypeId',
    GET_TRAINING_TYPES: '/trainings/types',
    GET_TRAINING_TYPE: '/trainings/types/:trainingTypeId',
    POST_EMPLOYEE: '/',
    POST_EMPLOYEE_DOC: '/:employeeId/docs',
    POST_EMPLOYEE_ABSENCE: '/:employeeId/absences',
    POST_EMPLOYEE_LICENSE: '/:employeeId/licenses',
    POST_EMPLOYEE_VACATION: '/:employeeId/vacations',
    POST_EMPLOYEE_TRAINING: '/:employeeId/trainings',
    POST_EMPLOYEE_FORMAL_WARNING: '/:employeeId/formal-warnings',
    POST_EMPLOYEE_EXTRA_HOUR: '/:employeeId/extra-hours',
    POST_EMPLOYEE_LATE_ARRIVAL: '/:employeeId/late-arrivals',
    POST_EMPLOYEE_FAMILY_MEMBER: '/:employeeId/family',
    POST_LICENSE_TYPE: '/licenses/types',
    POST_TRAINING_TYPE: '/trainings/types',
    PUT_EMPLOYEE: '/:employeeId',
    PUT_EMPLOYEE_IMAGE: '/:employeeId/image',
    PUT_EMPLOYEE_DOC: '/:employeeId/docs/:docId',
    PUT_EMPLOYEE_FAMILY_MEMBER: '/:employeeId/family/:familyMemberId',
    PUT_LICENSE_TYPE: '/licenses/types/:licenseTypeId',
    PUT_TRAINING_TYPE: '/trainings/types/:trainingTypeId',
    DELETE_EMPLOYEE: '/:employeeId',
    DELETE_EMPLOYEE_DOC: '/:employeeId/docs/:docId',
    DELETE_EMPLOYEE_LICENSE: '/:employeeId/licenses/:licenseId',
    DELETE_EMPLOYEE_VACATION: '/:employeeId/vacations/:vacationId',
    DELETE_EMPLOYEE_FAMILY_MEMBER: '/:employeeId/family/:familyMemberId',
    DELETE_LICENSE_TYPE: '/licenses/types/:licenseTypeId',
    DELETE_TRAINING_TYPE: '/trainings/types/:trainingTypeId',
  },
  NOTIFICATIONS: {
    ROOT: '/notifications',
    GET_NOTIFICATIONS: '/',
    GET_NOTIFICATION: '/:notificationId',
    GET_RECEIVERS: '/receivers',
    GET_RECEIVERS_BY_AREA: '/:notificationId/receivers/:areaId',
    GET_TYPES: '/types',
    GET_TYPE: '/types/:typeId',
    POST_NOTIFICATION: '/',
    POST_TYPE: '/types',
    PUT_TYPE: '/types/:typeId',
    DELETE_TYPE: '/types/:typeId',
  },
  PARAMS: {
    ROOT: '/params',
    GET_RELATIONSHIPS: '/relationships',
    GET_STATUS: '/status',
    GET_ROLES: '/roles',
    GET_GENDERS: '/genders',
    GET_AREAS: '/areas',
    GET_CIVIL_STATUS: '/civil-status',
  },
  USERS: {
    ROOT: '/users',
    GET_USERS: '/',
    GET_LOGIN_LOGS: '/login-logs',
    POST_USER: '/',
    POST_READ_ONLY_USER: '/create-read-only',
    PUT_CREATE_ADMIN: '/create-admin/:userId',
    DELETE_ADMIN_USER: '/delete-admin/:userId',
    DELETE_READ_ONLY_USER: '/delete-read-only/:userId',
  },
};

export const getEndpoint = (category, endpoint, ...replaceValues) => {
  const endpoints = ENDPOINTS[category];
  const rootEndpoint = endpoints.ROOT;

  let finalEndpoint = endpoint;
  if (replaceValues) {
    // find the first parameter in the link and replace it with the value
    replaceValues.forEach((replaceValue) => {
      finalEndpoint = finalEndpoint.replace(/:\w+/, replaceValue);
    });
  }

  return `/api/v1${rootEndpoint}${finalEndpoint}`;
};
