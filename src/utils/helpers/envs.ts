import { str, bool, port, cleanEnv } from 'envalid';
import 'dotenv/config';

import { Env } from '@/utils/constants/envs';

export const getEnv = (): string => process.env.NODE_ENV || Env.DEVELOPMENT;

export const isDevelopmentEnv = (): boolean => getEnv() !== Env.PRODUCTION;

export const validateEnv = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production', 'staging'],
      default: 'development',
    }),
    PORT: port({ default: 3000 }),

    DB_HOST: str({ default: 'localhost' }),
    DB_PORT: port({ default: 5432 }),
    DB_NAME: str(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_SSL: bool({ default: false }),

    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str({ default: '15m' }),
    JWT_REFRESH_SECRET: str(),
    JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  });
};
