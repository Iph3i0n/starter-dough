import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Css, { Keyframes, Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Animation from "Src/styles/Animation";
import Colour from "Src/styles/Colour";
import Flex from "Src/styles/Flex";
import Padding from "Src/styles/Padding";
import Transition from "Src/styles/Transition";
import { ColourNames, CT, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import { useEffect, useState } from "preact/hooks";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";

const Props = {
  value: IsString,
  colour: IsString,
  labels: Optional(IsLiteral(true)),
  striped: Optional(IsLiteral(true)),
};

export default class Progress extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const [values, set_values] = useState<(readonly [number, Colour])[]>([]);
    useEffect(() => {
      const initial = props.colour.split(",");
      const colours = props.colour.split(",").filter(IsOneOf(...ColourNames));
      if (initial.length !== colours.length)
        throw new Error("Some colours are invalid");

      const input = props.value.split(",").map((e) => parseInt(e));
      if (input.length < colours.length)
        throw new Error("Not enough colours for the values");

      const final = input
        .map((v, i) => [v, GetColour(colours[i])] as const)
        .sort((a, b) => a[0] - b[0]);
      set_values(final);
    }, [props.colour, props.value]);

    let styles = Css.Init()
      .With(
        Rule.Init(".container")
          .With(CT.colours.surface)
          .With(CT.border.standard)
          .With(CT.box_shadow.large)
          .With("height", CT.padding.block.X)
          .With("margin", "0")
          .With("padding", "0")
          .With("position", "relative")
          .With("overflow", "hidden")
          .With("font-size", "0")
      )
      .With(
        Rule.Init(".progress")
          .With("height", "100%")
          .With(new Transition("slow", "width"))
          .With(new Flex("center", "center", { inline: true }))
          .With(CT.text.small.WithPadding(new Padding("margin", "0")))
      );

    let used = 0;
    for (const [value, colour, index] of values.map(
      (v, i) => [...v, i] as const
    )) {
      const final = value - used;
      used = value;
      styles = styles.With(
        Rule.Init(`.progress:nth-child(${index + 1})`)
          .With(colour)
          .With("width", final + "%")
      );
    }

    if (props.striped)
      styles = styles
        .With(
          Keyframes.Init("stripes")
            .With(Rule.Init("from").With("background-position-x", "0"))
            .With(
              Rule.Init("to").With("background-position-x", CT.padding.block.X)
            )
        )
        .With(
          Rule.Init(".striped")
            .With(
              "background-image",
              "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)"
            )
            .With(
              new Absolute({
                top: "0",
                left: "0",
                width: used + "%",
                height: "100%",
              })
            )
            .With(
              "background-size",
              CT.padding.block.X + " " + CT.padding.block.X
            )
            .With(new Animation("stripes", "slow", "infinite"))
            .With("animation-iteration-count", "linear")
        );

    return WithStyles(
      <div class="container">
        {values.map(([value]) => (
          <div class="progress">
            {props.labels && <>{value.toString() + "%"}</>}
          </div>
        ))}

        {props.striped && <div class="striped" />}
      </div>,
      styles
    );
  }
}
