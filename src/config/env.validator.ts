import { customCleanEnv } from 'envalid';

import { EnvSchema } from './env.schema';

export function validateEnv() {
  return customCleanEnv(process.env, EnvSchema, (cleanedEnv) => ({
    ...cleanedEnv,
    CORS_ORIGINS: cleanedEnv.CORS_ORIGINS.split(','),
  }));
}
