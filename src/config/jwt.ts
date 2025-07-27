import { registerAs } from '@nestjs/config';

import { validateEnv } from '@/utils/helpers/envs';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

const env = validateEnv();

export const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  }),
);
