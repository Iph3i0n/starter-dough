import { IsObject, IsType } from "@paulpopat/safe-type";

export const IsEmptyProps = IsObject({});

export type EmptyProps = IsType<typeof IsEmptyProps>;
