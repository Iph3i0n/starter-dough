import { IsObject } from "@paulpopat/safe-type";
import PreactComponent, { Child } from "Src/BuildComponent";

type State = { render: Child<any, PreactComponent<any, any>>; state: any };

export default class ChildComponent extends PreactComponent<any, State> {
  public constructor() {
    super();
    this.ChildType.then((p) => {
      this.State = { render: p, state: p.parent.State };
      p.parent.OnState = (state: any) => {
        this.State = { ...this.State, state: state };
      };
    });
  }

  protected override Render(props: any, state: State): any {
    if (!state) return <></>;

    if (!IsObject(state.render.is_props)(props, false))
      throw new Error("Invalid props for " + this.tagName);

    return state.render.handler.bind(this)(props, state.render.parent);
  }

  protected override IsProps = {};
}
