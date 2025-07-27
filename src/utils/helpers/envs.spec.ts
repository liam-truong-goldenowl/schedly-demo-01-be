import { Env } from '../constants/envs';

import { getEnv, isDevelopmentEnv } from './envs';

describe('getEnv', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should return NODE_ENV if set', () => {
    process.env.NODE_ENV = Env.PRODUCTION;
    expect(getEnv()).toBe(Env.PRODUCTION);

    process.env.NODE_ENV = Env.DEVELOPMENT;
    expect(getEnv()).toBe(Env.DEVELOPMENT);

    process.env.NODE_ENV = Env.STAGING;
    expect(getEnv()).toBe(Env.STAGING);
  });

  it('should return Env.DEVELOPMENT if NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    expect(getEnv()).toBe(Env.DEVELOPMENT);
  });
});

describe('isDevelopmentEnv', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should return false if NODE_ENV is production', () => {
    process.env.NODE_ENV = Env.PRODUCTION;
    expect(isDevelopmentEnv()).toBe(false);
  });

  it('should return true if NODE_ENV is development', () => {
    process.env.NODE_ENV = Env.DEVELOPMENT;
    expect(isDevelopmentEnv()).toBe(true);
  });

  it('should return true if NODE_ENV is sSTAGING', () => {
    process.env.NODE_ENV = Env.STAGING;
    expect(isDevelopmentEnv()).toBe(true);
  });

  it('should return true if NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    expect(isDevelopmentEnv()).toBe(true);
  });
});
