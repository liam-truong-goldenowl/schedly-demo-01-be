import { str, bool, port, host } from 'envalid';

export const EnvSchema = {
  PORT: port({
    default: 3000,
  }),
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production', 'staging'],
  }),

  CORS_ORIGINS: str({
    desc: 'Comma-separated list of allowed origins for CORS',
  }),

  DB_SSL: bool({
    default: false,
    desc: 'Use SSL for database connection. `true` for remote, `false` for local',
  }),
  DB_PORT: port({
    default: 5432,
    desc: 'Database port',
  }),
  DB_HOST: host({
    default: 'localhost',
    desc: 'Database host',
  }),
  DB_NAME: str({
    desc: 'Database name',
  }),
  DB_USER: str({
    desc: 'Database username',
  }),
  DB_PASSWORD: str({
    desc: 'Database password',
  }),

  JWT_SECRET: str({
    desc: 'access token secret',
  }),
  JWT_EXPIRES_IN: str({
    default: '15m',
    desc: 'access token expiration time',
  }),
  JWT_REFRESH_SECRET: str({
    desc: 'refresh token secret',
  }),
  JWT_REFRESH_EXPIRES_IN: str({
    default: '7d',
    desc: 'refresh token expiration time',
  }),

  MAIL_HOST: host({
    desc: 'Mail server host',
  }),
  MAIL_PORT: port({
    desc: 'Mail server port',
  }),
  MAIL_USER: str({
    desc: 'Mail server user',
  }),
  MAIL_PASS: str({
    desc: 'Mail server password',
  }),
  MAIL_SENDER: str({
    desc: 'Mail sender address',
  }),
};
