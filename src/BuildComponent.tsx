import { Checker, IsObject } from "@paulpopat/safe-type";
import { Fragment, h } from "preact";
import { useEffect } from "preact/hooks";
import { GetComponent } from "./utils/Html";
import Object from "./utils/Object";
import { FC } from "./utils/Type";

function ProcessProps(props: any) {
  return Object.MapKeys(props, (_, value) =>
    value === "" ? true : value === "true" ? true : value
  );
}

export default function BuildComponent<TProps extends Record<string, any> = {}>(
  is_props: { [TKey in keyof TProps]: Checker<TProps[TKey]> },
  Target: FC<TProps>
): FC<any> {
  return function (p) {
    const props = ProcessProps(p);
    if (!IsObject(is_props)(props, false)) {
      return h(Fragment, {});
    }

    useEffect(() => {
      const main = GetComponent(this);
      if (!main) return;
    }, []);
    return <Target {...props} />;
  };
}
