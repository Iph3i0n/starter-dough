import {
  h,
  createContext,
  FunctionComponent,
  Context,
  RenderableProps,
  JSX,
} from "preact";
import { useContext, useMemo, useState } from "preact/hooks";

const IndexContext = createContext({ register: () => 1 as number, total: 0 });

export function WithIndex<TProps>(
  handler: (props: RenderableProps<TProps>, total: number) => JSX.Element
): FunctionComponent<TProps> {
  return (props) => {
    const [total, set_total] = useState(0);

    return h(IndexContext.Provider, {
      value: {
        register: () => {
          let result = 0;
          set_total((c) => {
            result = c;
            return c + 1;
          });

          return result;
        },
        total,
      },
      children: handler(props, total),
    });
  };
}

export function UseIndex() {
  const { register, total } = useContext(IndexContext);
  const index = useMemo(() => register(), []);
  return { index, total };
}
