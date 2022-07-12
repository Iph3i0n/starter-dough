import { IsString } from "@paulpopat/safe-type";
import { NodeModel } from "./utils/Html";
import Object from "./utils/Object";

declare global {
  namespace JSX {
    type IntrinsicElements = Record<string, any>;

    type HtmlTag = keyof IntrinsicElements;

    type Element = NodeModel[];
  }
}

type JSXTag = JSX.HtmlTag | ((props: any, ...children: any[]) => NodeModel[]);

const Result = {
  Element(
    tag: JSXTag,
    props: Record<string, any>,
    ...children: NodeModel[][]
  ): NodeModel[] {
    if (!IsString(tag)) return tag(props, ...children);

    return [
      {
        tag,
        props: Object.FilterKeys(props, (k) => !k.startsWith("on_")),
        handlers: Object.FilterKeys(props, (k) => k.startsWith("on_")),
        children: children.flat(2),
      },
    ];
  },
  Fragment(_: any, ...children: NodeModel[][]) {
    return children.flat(2);
  },
};

export default Result;
