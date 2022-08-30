import { Sizes, CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import PreactComponent, { FromProps } from "Src/BuildComponent";

const Props = {
  "full-width": Optional(IsLiteral(true)),
  flush: Optional(IsLiteral(true)),
  fill: Optional(IsLiteral(true)),
};

export default class Container extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    let rule = Rule.Init(":host(:not(.full-width))");

    for (const size of Sizes) {
      rule = rule.With(
        "max-width",
        CT.screen[size].width,
        "min-width:" + CT.screen[size].breakpoint
      );
    }

    return WithStyles(
      <slot />,
      Css.Init()
        .With(
          Rule.Init(":host")
            .With("display", "block")
            .With("margin", "auto")
            .With("max-width", "100%")
            .With("height", props.fill ? "100vh" : "100%")
            .With("box-sizing", "border-box")
            .With(props.flush ? new Padding("padding", "0") : CT.padding.block)
        )
        .With(Rule.Init(":host(.full-width)").With("max-width", "100%"))
        .With(rule)
    );
  }
}
