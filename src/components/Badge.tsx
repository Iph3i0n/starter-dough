import Register from "Src/Register";
import { Fragment } from "preact";
import { ColourName, ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import WithStyles from "Src/utils/Styles";
import { IsOneOf } from "Src/utils/Type";
import { IsLiteral, Optional } from "@paulpopat/safe-type";

declare global {
  namespace Jsx {
    interface IntrinsicElements {
      "p-badge": { colour: ColourName; "top-right"?: true };
    }
  }
}

Register(
  "p-badge",
  { colour: IsOneOf(...ColourNames), "top-right": Optional(IsLiteral(true)) },
  (props) => {
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

    return WithStyles(<>{props.children}</>, Css.Init().With(rule));
  }
);
