import { registerAs } from '@nestjs/config';

import { validateEnv } from '@/utils/helpers/envs';

export interface IAppConfig {
  env: string;
  port: number;
  corsOrigin: string;
}

export const appConfig = registerAs('app', (): IAppConfig => {
  const env = validateEnv();

  return { port: env.PORT, env: env.NODE_ENV, corsOrigin: env.CORS_ORIGIN };
});
