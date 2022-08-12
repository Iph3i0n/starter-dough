import { ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import WithStyles from "Src/utils/Styles";
import { IsOneOf } from "Src/utils/Type";
import { Checker, IsLiteral, Optional } from "@paulpopat/safe-type";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import { JSX } from "preact/jsx-runtime";

const Props = {
  colour: IsOneOf(...ColourNames),
  "top-right": Optional(IsLiteral(true)),
};

export default class Badge extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }
  
  protected Render(props: FromProps<typeof Props>, state: {}): JSX.Element {
    let rule = Rule.Init(":host")
      .With(GetColour(props.colour))
      .With(CT.padding.badge)
      .With("display", "inline-block")
      .With(CT.border.small);
    if (props["top-right"])
      rule = rule
        .With(
          new Absolute({ top: "0", right: "0", translate: ["50%", "-50%"] })
        )
        .With(CT.box_shadow.small);

    return WithStyles(<slot />, Css.Init().With(rule));
  }

  protected override IsProps = Props;
}
