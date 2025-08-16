export class ArrayHelper {
  static getCombinations<T>(arr: T[], k: number): T[][] {
    if (k === 0) return [[]];
    if (arr.length < k) return [];

    const [first, ...rest] = arr;

    const withFirst = ArrayHelper.getCombinations(rest, k - 1).map((comb) => [
      first,
      ...comb,
    ]);
    const withoutFirst = ArrayHelper.getCombinations(rest, k);

    return [...withFirst, ...withoutFirst];
  }
}
