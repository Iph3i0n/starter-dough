import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import Css, { CssProperty, Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";

Define(
  "p-badge",
  { colour: IsOneOf(...ColourNames), "top-right": Optional(IsLiteral(true)) },
  { open: true },
  {
    render() {
      return <slot />;
    },
    css() {
      let rule = Rule.Init(":host")
        .With(GetColour(this.Props.colour))
        .With(CT.padding.badge)
        .With("display", "inline-block")
        .With(CT.border.small);
      if (this.Props["top-right"])
        rule = rule
          .With(
            new Absolute({ top: "0", right: "0", translate: ["50%", "-50%"] })
          )
          .With(CT.box_shadow.small);

      return Css.Init().With(rule);
    },
  }
);
