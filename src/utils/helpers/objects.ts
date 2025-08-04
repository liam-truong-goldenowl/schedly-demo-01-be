/**
 * Determines if the provided value is a plain object (excluding arrays and null).
 *
 * @param obj - The value to check.
 * @returns `true` if the value is a non-null object and not an array, otherwise `false`.
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Deeply merges two objects, giving precedence to properties from the `source` object.
 * If both `target` and `source` have a property that is an object, those objects are merged recursively.
 * Otherwise, the property from `source` overwrites the one in `target`.
 *
 * @template T - Type of the target object.
 * @template S - Type of the source object.
 * @param target - The target object to merge into.
 * @param source - The source object whose properties will overwrite or merge into the target.
 * @returns A new object resulting from deeply merging `target` and `source`.
 *
 * @example
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 }, e: 4 };
 * const merged = mergeDeepRight(obj1, obj2);
 * // merged will be { a: 1, b: { c: 2, d: 3 }, e: 4 }
 */
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
