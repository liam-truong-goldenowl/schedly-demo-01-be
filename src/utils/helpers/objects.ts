export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export function mergeDeepRight<
  T extends Record<string, any>,
  S extends Record<string, any>,
>(target: T, source: S): T & S {
  if (!isObject(target)) return source as T & S;

  const result: Record<string, any> = { ...target };

  for (const key in source) {
    if (isObject(source[key]) && isObject(target[key])) {
      result[key] = mergeDeepRight(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result as T & S;
}
