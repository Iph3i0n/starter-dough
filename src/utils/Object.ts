import { Range } from "./Type";

function AsReadonly<T>(input: T): Readonly<T> {
  if (Array.isArray(input) || typeof input !== "object") return input;

  const subject = input as any;
  let result = {} as any;
  for (const key in subject)
    if (!subject.hasOwnProperty(key)) continue;
    else
      result = Object.assign(result, {
        get [key]() {
          return AsReadonly(subject[key]);
        },
      });

  return result;
}

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
  MapArray<T, TResult>(keys: T[], mapper: (key: T) => TResult): TResult {
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
  Range<TMax extends number>(max: TMax): Range<0, TMax>[] {
    const result = [];
    for (let i = 1; i <= max; i++) result.push(i);

    return result as any;
  },
  AsReadonly: AsReadonly,
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
};
