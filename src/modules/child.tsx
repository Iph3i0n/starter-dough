import { useContext } from "preact/hooks";
import { ChildContext } from "Src/contexts/WithChild";
import { FC } from "Src/utils/Type";

const Component: FC<any> = (props) => {
  const Child = useContext(ChildContext);
  if (!Child) {
    return <></>;
  }

  return <Child {...props} />;
};

export default Component;
