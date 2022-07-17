import { IsString } from "@paulpopat/safe-type";

export default function C(...classes: (string | [string, boolean])[]) {
  return classes
    .map((c) => (IsString(c) ? c : c[1] ? c[0] : undefined))
    .filter((c) => c)
    .join(" ");
}

export function Pad(...amounts: string[]) {
  return amounts.join(" ");
}

export function Trans(speed: string, ...areas: string[]) {
  return areas.map((a) => `${a} ${speed}`).join(", ");
}
