import { str, bool, port, cleanEnv } from 'envalid';
import 'dotenv/config';

export const validateEnv = () => {
  return cleanEnv(process.env, {
    PORT: port({ default: 3000 }),
    NODE_ENV: str({
      choices: ['development', 'production', 'staging'],
      default: 'development',
    }),
    CORS_ORIGIN: str({
      default: 'http://localhost:3000',
      desc: 'Comma-separated list of allowed origins for CORS',
    }),

    DB_PORT: port({ default: 5432 }),
    DB_SSL: bool({ default: false }),
    DB_HOST: str({ default: 'localhost' }),
    DB_NAME: str({ desc: 'Database name' }),
    DB_USERNAME: str({ desc: 'Database username' }),
    DB_PASSWORD: str({ desc: 'Database password' }),

    JWT_SECRET: str({ desc: 'access token secret' }),
    JWT_EXPIRES_IN: str({
      default: '15m',
      desc: 'access token expiration time',
    }),
    JWT_REFRESH_SECRET: str({ desc: 'refresh token secret' }),
    JWT_REFRESH_EXPIRES_IN: str({
      default: '7d',
      desc: 'refresh token expiration time',
    }),
  });
};
