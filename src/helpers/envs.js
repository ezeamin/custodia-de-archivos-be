import envvar from 'env-var';

const { get } = envvar;

export const envs = {
  PORT: get('PORT').default('3000').asPortNumber(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  DIRECT_URL: get('DIRECT_URL').required().asString(),
  JWT_SECRET_KEY: get('JWT_SECRET_KEY').required().asString(),
  CLIENT_URL: get('CLIENT_URL').required().asUrlString(),
  CLIENT_RESET_PASS_PATH: get('CLIENT_RESET_PASS_PATH').required().asString(),
  CLOUDINARY: {
    CLOUD_NAME: get('CLOUD_NAME').required().asString(),
    API_KEY: get('API_KEY').required().asString(),
    API_SECRET: get('API_SECRET').required().asString(),
  },
  MAIL: {
    USER: get('MAIL_USER').required().asString(),
    PASS: get('MAIL_PASS').required().asString(),
    HOST: get('MAIL_HOST').default('587').asString(),
    PORT: get('MAIL_PORT').required().asPortNumber(),
  },
  TESTING: {
    ACCESS_TOKEN_ADMIN: get('TEST_ACCESS_TOKEN_ADMIN').default('').asString(),
    REFRESH_TOKEN_ADMIN: get('TEST_REFRESH_TOKEN_ADMIN').default('').asString(),
    ACCESS_TOKEN_EMPLOYEE: get('TEST_ACCESS_TOKEN_EMPLOYEE')
      .default('')
      .asString(),
    ACCESS_TOKEN_READ_ONLY: get('TEST_ACCESS_TOKEN_READ_ONLY')
      .default('')
      .asString(),
    REAL_USER_ACCESS_TOKEN: get('TEST_REAL_USER_ACCESS_TOKEN')
      .default('')
      .asString(),
    USER: {
      USERNAME: get('TEST_USER_NAME').default('').asString(),
      PASSWORD: get('TEST_USER_PASS').default('').asString(),
    },
  },
};
