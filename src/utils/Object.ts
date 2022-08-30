export default {
  Keys<T extends object>(subject: T): (keyof T)[] {
    return Object.keys(subject) as any;
  },
  MapKeys<T extends object, TResult extends { [TKey in keyof T]: any }>(
    subject: T,
    mapper: <TKey extends keyof T>(key: TKey, value: T[TKey]) => TResult[TKey]
  ): TResult {
    const result = {} as any;
    for (const key in subject)
      if (!subject.hasOwnProperty(key)) continue;
      else result[key] = mapper(key, subject[key]);

    return result;
  },
  MapArrayAsKeys<T extends string, TResult>(
    keys: T[],
    mapper: (key: T) => TResult
  ): Record<T, TResult> {
    let result = {} as any;
    for (const key of keys) result = { ...result, [key]: mapper(key) };
    return result;
  },
  Range(max: number): number[] {
    const result = [];
    for (let i = 1; i <= max; i++) result.push(i);

    return result as any;
  },
  DeepMerge<T extends object>(item1: T, item2: any): T {
    const result = {} as any;
    for (const key in item1)
      if (!item1.hasOwnProperty(key)) continue;
      else if (typeof item1[key] !== "object")
        if (item2[key]) result[key] = item2[key];
        else result[key] = item1[key];
      else if (item2[key]) result[key] = { ...item1[key], ...item2[key] };
      else result[key] = item1[key];

    return result;
  },
};
