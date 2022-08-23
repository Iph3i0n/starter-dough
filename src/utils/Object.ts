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
  MapArray<T, TResult>(
    keys: T[],
    mapper: (key: T) => Partial<TResult>
  ): TResult {
    let result = {} as any;
    for (const key of keys) result = { ...result, ...mapper(key) };
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
  AsReadonly<T>(input: T): Readonly<T> {
    const _this = this;
    if (Array.isArray(input) || typeof input !== "object") return input;

    const subject = input as any;
    let result = {} as any;
    for (const key in subject)
      if (!subject.hasOwnProperty(key)) continue;
      else
        result = Object.assign(result, {
          get [key]() {
            return _this.AsReadonly(subject[key]);
          },
        });

    return result;
  },
  FilterKeys<T extends object>(
    subject: T,
    predicate: (key: keyof T) => boolean
  ): Partial<T> {
    let result = {} as any;
    for (const key in subject)
      if (!subject.hasOwnProperty(key)) continue;
      else if (predicate(key)) result[key] = subject[key];
    return result;
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
  Access(item: any, key: string): any {
    const target = key.split(".");
    const result = item[target[0]];
    if (target.length > 1)
      return this.Access(result, target.slice(1).join("."));
    return result;
  },
  GetPrototypeOf<T>(target: T) {
    return Object.getPrototypeOf(target);
  },
  Assign<T, TResult>(subject: T, add: TResult): T & TResult {
    return Object.assign(subject, add);
  },
  DefineProperty<T, TKey extends string, TValue>(
    subject: T,
    key: TKey,
    value:
      | { writable: boolean; value: TValue }
      | { get(this: T): TValue; set(this: T, value: TValue): void }
  ) {
    return Object.defineProperty(subject, key, value);
  },
  Create(subject: any) {
    return Object.create(subject);
  },
};
