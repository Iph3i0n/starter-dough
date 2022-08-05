import { ColourNames, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
// @ts-ignore: Importing CSS file content
import style from "remixicon/fonts/remixicon.css";
import Css, { Keyframes, Rule } from "Src/CSS";
import Animation from "Src/styles/Animation";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  {
    name: IsString,
    size: IsString,
    colour: Optional(IsOneOf(...ColourNames)),
    text: Optional(IsLiteral(true)),
    spin: Optional(IsLiteral(true)),
  },
  ({ name, size, colour, text, spin }) => {
    const input_colour = GetColour(colour ?? "body");
    let result = Css.Init()
      .With(
        Rule.Init("span")
          .With("line-height", "1.2")
          .With("font-size", size)
          .With(text ? input_colour.OnlyText() : input_colour.AsText())
      )
      .With(style);

    if (spin)
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

    return WithStyles(<span class={`ri-${name}-line`} />, result);
  }
);
