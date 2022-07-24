import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Jsx from "Src/Jsx";
import { ColourNames, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
// @ts-ignore: Importing CSS file content
import style from "remixicon/fonts/remixicon.css";
import Css, { Keyframes, Rule } from "Src/CSS";
import Animation from "Src/styles/Animation";

Define(
  "p-icon",
  {
    name: IsString,
    size: IsString,
    colour: IsOneOf(...ColourNames),
    text: Optional(IsLiteral(true)),
    spin: Optional(IsLiteral(true)),
  },
  {},
  {
    render() {
      return <span class={`ri-${this.Props.name}-line`} />;
    },
    css() {
      const colour = GetColour(this.Props.colour);
      let result = Css.Init().With(
        Rule.Init("span")
          .With("line-height", "1.2")
          .With("font-size", this.Props.size)
          .With(this.Props.text ? colour.OnlyText() : colour.AsText())
      );

      if (this.Props.spin)
        result = result
          .With(
            Keyframes.Init("spin")
              .With(Rule.Init("from").With("transform", "rotate(0deg)"))
              .With(Rule.Init("to").With("transform", "rotate(360deg)"))
          )
          .With(
            Rule.Init("span:before")
              .With(new Animation("spin", "slow", "infinite"))
              .With("display", "inline-block")
          );

      return result;
    },
    additional_css: style,
  }
);
