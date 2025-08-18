import { ArrayHelper } from './array.helper';

describe('ArrayHelper', () => {
  describe('getCombinations', () => {
    it('should return empty array when k is greater than array length', () => {
      const result = ArrayHelper.getCombinations([1, 2, 3], 4);
      expect(result).toEqual([]);
    });

    it('should return array with empty array when k is 0', () => {
      const result = ArrayHelper.getCombinations([1, 2, 3], 0);
      expect(result).toEqual([[]]);
    });

    it('should return correct combinations when k is 1', () => {
      const result = ArrayHelper.getCombinations([1, 2, 3], 1);
      expect(result).toEqual([[1], [2], [3]]);
    });

    it('should return correct combinations when k is 2', () => {
      const result = ArrayHelper.getCombinations([1, 2, 3], 2);
      expect(result).toEqual([
        [1, 2],
        [1, 3],
        [2, 3],
      ]);
    });

    it('should return correct combinations when k equals array length', () => {
      const result = ArrayHelper.getCombinations([1, 2, 3], 3);
      expect(result).toEqual([[1, 2, 3]]);
    });

    it('should work with strings', () => {
      const result = ArrayHelper.getCombinations(['a', 'b', 'c'], 2);
      expect(result).toEqual([
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c'],
      ]);
    });

    it('should work with mixed types', () => {
      const result = ArrayHelper.getCombinations([1, 'a', true], 2);
      expect(result).toEqual([
        [1, 'a'],
        [1, true],
        ['a', true],
      ]);
    });

    it('should handle empty array input', () => {
      const result = ArrayHelper.getCombinations([], 1);
      expect(result).toEqual([]);
    });
  });
});
