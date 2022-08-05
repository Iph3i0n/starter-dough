import { createContext } from "preact";
import { Checker, IsObject } from "@paulpopat/safe-type";
import { FC } from "Src/utils/Type";

export const ChildContext = createContext<FC<any>>(undefined as any);

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
