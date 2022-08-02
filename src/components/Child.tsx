import Register from "Src/Register";
import { createContext, h, Fragment, FunctionComponent } from "preact";
import { Checker, IsObject } from "@paulpopat/safe-type";
import { useContext } from "preact/hooks";
import { CustomElement, FC } from "Src/utils/Type";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      ["p-child"]: CustomElement<any, "">;
    }
  }
}

const ChildContext = createContext<FC<any>>(() => <></>);

export default function WithChild<TProps, TChildProps>(
  Main: FC<TProps>,
  child_checker: { [TKey in keyof TChildProps]: Checker<TChildProps[TKey]> },
  Child: FC<TChildProps>
): FC<TProps> {
  const ChildValue: FC<any> = (props) => {
    if (!IsObject(child_checker)(props, false)) {
      throw new Error("Invalid props for child container");
    }

    return <Child {...(props as any)} />;
  };

  return (props) => {
    return (
      <ChildContext.Provider value={ChildValue}>
        <Main {...props} />
      </ChildContext.Provider>
    );
  };
}

Register("p-child", {}, (props) => {
  const Child = useContext(ChildContext);
  return <Child {...props} />;
});
