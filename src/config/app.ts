import { registerAs } from '@nestjs/config';

export type TAppConfig = {
  port: number | string;
  env: string;
};

export const appConfig = registerAs('app', (): TAppConfig => {
  return {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  };
});
