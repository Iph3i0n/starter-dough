export default {
  GroupBy<T, TKey>(subject: T[], selector: (value: T) => TKey) {
    const result: [TKey, T[]][] = [];

    for (const item of subject) {
      const key = selector(item);
      const current = result.find((r) => r[0] === key);
      if (current) current[1].push(item);
      else result.push([key, [item]]);
    }

    return result;
  },
};
