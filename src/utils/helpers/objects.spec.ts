import { isObject, mergeDeepRight } from './objects';

describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it('should return false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isObject(42)).toBe(false);
    expect(isObject('string')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });

  it('should return true for objects created with Object.create(null)', () => {
    expect(isObject(Object.create(null))).toBe(true);
  });
});

describe('mergeDeepRight', () => {
  it('should deeply merge two objects', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };
    expect(mergeDeepRight(target, source)).toEqual({
      a: 1,
      b: { c: 2, d: 3 },
      e: 4,
    });
  });

  it('should overwrite primitive values from source', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3 };
    expect(mergeDeepRight(target, source)).toEqual({ a: 1, b: 3 });
  });

  it('should overwrite arrays from source', () => {
    const target = { a: [1, 2], b: { c: 3 } };
    const source = { a: [3, 4] };
    expect(mergeDeepRight(target, source)).toEqual({ a: [3, 4], b: { c: 3 } });
  });

  it('should merge nested objects', () => {
    const target = { a: { b: { c: 1 } } };
    const source = { a: { b: { d: 2 } } };
    expect(mergeDeepRight(target, source)).toEqual({
      a: { b: { c: 1, d: 2 } },
    });
  });

  it('should return source if target is not an object', () => {
    expect(mergeDeepRight(null as any, { a: 1 })).toEqual({ a: 1 });
    expect(mergeDeepRight(undefined as any, { a: 1 })).toEqual({ a: 1 });
    expect(mergeDeepRight(42 as any, { a: 1 })).toEqual({ a: 1 });
  });

  it('should handle empty source', () => {
    const target = { a: 1 };
    expect(mergeDeepRight(target, {})).toEqual({ a: 1 });
  });

  it('should handle empty target', () => {
    const source = { a: 1 };
    expect(mergeDeepRight({}, source)).toEqual({ a: 1 });
  });

  it('should not mutate the original objects', () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    const result = mergeDeepRight(target, source);
    expect(result).not.toBe(target);
    expect(result.a).not.toBe(target.a);
  });
});
