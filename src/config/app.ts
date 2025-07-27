import { registerAs } from '@nestjs/config';

import { validateEnv } from '@/utils/helpers/envs';

export interface AppConfig {
  port: number;
  env: string;
}

const env = validateEnv();

export const appConfig = registerAs('app', (): AppConfig => {
  return {
    port: env.PORT,
    env: env.NODE_ENV,
  };
});
