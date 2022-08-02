import { Checker, IsObject } from "@paulpopat/safe-type";
import { Fragment, h } from "preact";
import register from "preact-custom-element";
import Object from "./utils/Object";
import { FC } from "./utils/Type";

function ProcessProps(props: any) {
  return Object.MapKeys(props, (_, value) =>
    value === "" ? true : value === "true" ? true : value
  );
}

export default function Register<
  TTag extends string,
  TProps extends Record<string, any> = {}
>(
  tag: TTag,
  is_props: { [TKey in keyof TProps]: Checker<TProps[TKey]> },
  render: FC<TProps>
) {
  register(
    (props) => {
      props = ProcessProps(props);
      if (!IsObject(is_props)(props, false)) {
        return h(Fragment, {});
      }
      return render(props);
    },
    tag,
    Object.Keys(is_props) as any,
    { shadow: true }
  );

  return [tag, render];
}
