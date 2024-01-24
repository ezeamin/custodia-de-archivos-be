import envvar from 'env-var';

const { get } = envvar;

export const envs = {
  PORT: get('PORT').default('3000').asPortNumber(),
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
};
