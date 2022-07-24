import { Checker, IsIntersection, IsUnion } from "@paulpopat/safe-type";

type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A["length"] ? 0 : 1];

export type Enumerate<N extends number> = EnumerateInternal<
  [],
  N
> extends (infer E)[]
  ? E
  : never;

export type Range<FROM extends number, TO extends number> =
  | Exclude<Enumerate<TO>, Enumerate<FROM>>
  | TO;

export function IsOneOf<T extends readonly string[]>(...possible: T) {
  return (arg: any): arg is T[number] => {
    return possible.includes(arg);
  };
}

export function IsUnionWithBase<TBase, TOptions extends readonly any[]>(
  base: Checker<TBase>,
  ...options: { [TKey in keyof TOptions]: Checker<TOptions[TKey]> }
) {
  return IsUnion(...options.map((o) => IsIntersection(base, o))) as Checker<
    TBase & TOptions[number]
  >;
}

export function IsHtmlElement(node: any): node is HTMLElement {
  return node && node.nodeType && node.nodeType === node.ELEMENT_NODE;
}
