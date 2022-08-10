import { ColourNames, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import Css, { Keyframes, Rule } from "Src/CSS";
import Animation from "Src/styles/Animation";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import PreactComponent, { FromProps } from "Src/BuildComponent";

const Props = {
  name: IsString,
  size: IsString,
  colour: Optional(IsOneOf(...ColourNames)),
  text: Optional(IsLiteral(true)),
  spin: Optional(IsLiteral(true)),
};

export default class Icon extends PreactComponent<typeof Props> {
  protected IsProps = Props;

  protected Render({
    name,
    size,
    colour,
    text,
    spin,
  }: FromProps<typeof Props>) {
    const input_colour = GetColour(colour ?? "body");
    let result = Css.Init().With(
      Rule.Init("span")
        .With("line-height", "1.2")
        .With("font-size", size)
        .With(text ? input_colour.OnlyText() : input_colour.AsText())
    );

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

    return WithStyles(
      <>
        <span class={`ri-${name}-line`} />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
          type="text/css;charset=UTF-8"
        />
      </>,
      result
    );
  }
}
