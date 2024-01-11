import envvar from 'env-var';

const { get } = envvar;

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  DIRECT_URL: get('DIRECT_URL').required().asString(),
  JWT_SECRET_KEY: get('JWT_SECRET_KEY').required().asString(),
  CLIENT_URL: get('CLIENT_URL').required().asUrlString(),
  MAIL: {
    USER: get('MAIL_USER').required().asString(),
    PASS: get('MAIL_PASS').required().asString(),
    HOST: get('MAIL_HOST').required().asString(),
  },
};
