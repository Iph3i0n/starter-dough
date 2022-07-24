import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Jsx from "Src/Jsx";
import { ColourNames, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
// @ts-ignore: Importing CSS file content
import style from "remixicon/fonts/remixicon.css";
import Css, { Rule } from "Src/CSS";

Define(
  "p-icon",
  {
    name: IsString,
    size: IsString,
    colour: IsOneOf(...ColourNames),
    text: Optional(IsLiteral(true)),
  },
  {},
  {
    render() {
      return <span class={`ri-${this.Props.name}-line`} />;
    },
    css() {
      const colour = GetColour(this.Props.colour);
      return Css.Init().With(
        Rule.Init("span")
          .With("font-size", this.Props.size)
          .With(this.Props.text ? colour.OnlyText() : colour.AsText())
      );
    },
    additional_css: style,
  }
);
