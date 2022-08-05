import { Suspense, lazy } from "preact/compat";
import { Component } from "preact";
import CustomElement from "Src/CustomElement";
import { FC } from "./utils/Type";

export default function AddComponent(
  tag: string,
  init: () => Promise<{ default: FC<any> }>
) {
  let loaded = false;
  const final = async () => {
    const r = await init();
    loaded = true;
    return r;
  };

  const Target = lazy(final);
  CustomElement(
    (props: any) => (
      <Suspense fallback={<></>}>
        <Target {...props} />
      </Suspense>
    ),
    tag,
    [],
    { shadow: true }
  );
}
