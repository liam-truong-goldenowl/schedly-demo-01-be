import 'dotenv/config';
import { str, bool, port, cleanEnv } from 'envalid';

/**
 * Validates and sanitizes application environment variables using envalid.
 *
 * This function constructs a typed configuration from process.env, applying
 * defaults, type coercion, and constraints for each supported variable. It
 * throws at startup if any required variable is missing or malformed.
 *
 * @returns A validated, typed, and read-only environment object exposing the listed variables.
 * @throws If validation fails due to missing or invalid environment variables.
 *
 * @example
 * const env = validateEnv();
 * server.listen(env.PORT);
 */
export function validateEnv() {
  return cleanEnv(process.env, {
    PORT: port({ default: 3000 }),
    NODE_ENV: str({
      choices: ['development', 'production', 'staging'],
      default: 'development',
    }),

    CORS_ORIGIN: str({
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
}

/**
 * Returns the validated environment configuration, memoized for the lifetime of the process.
 *
 * On first call, invokes `validateEnv()` and caches the result on `globalThis.env`.
 * Subsequent calls read from this cache to avoid re-validating environment variables.
 *
 * @remarks
 * - Ensure you have an ambient type declaration for `globalThis.env` to satisfy TypeScript.
 * - This approach keeps configuration stable and avoids repeated validation overhead.
 *
 * @returns The typed configuration produced by `validateEnv()`.
 * @throws If `validateEnv()` fails due to missing or invalid environment variables.
 *
 * @example
 * const env = getEnv();
 * console.log(env.NODE_ENV);
 *
 * @see validateEnv
 */
export function getEnv(): ReturnType<typeof validateEnv> {
  const isCached = globalThis.env !== undefined;

  if (!isCached) {
    globalThis.env = validateEnv();
  }

  return globalThis.env;
}
