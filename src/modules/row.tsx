import { CT, Sizes } from "Src/Theme";
import Css, { Media, Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import Grid from "Src/styles/Grid";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";
import { IsOneOf } from "Src/utils/Type";
import Object from "Src/utils/Object";
import Flex from "Src/styles/Flex";

const Props = {
  cols: Optional(IsString),
  flush: Optional(IsLiteral(true)),
  fill: Optional(IsOneOf("screen", "container")),
};

export default class Row extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  public constructor() {
    super();
    this.SetChild(
      {
        ...Object.MapArrayAsKeys(Sizes, () => Optional(IsString)),
        centre: Optional(IsLiteral(true)),
        align: Optional(IsOneOf("centre", "right", "left")),
      },
      function (props) {
        let css = Css.Init();

        for (const size of Sizes) {
          if (props[size])
            css = css.With(
              Media.Init("min-width", CT.screen[size].breakpoint).With(
                Rule.Init(":host").With(
                  "grid-column",
                  "auto / span " + props[size]
                )
              )
            );
        }

        if (props.centre || props.align)
          css = css.With(
            Rule.Init(":host").With(
              new Flex(
                props.centre ? "center" : "flex-start",
                props.align === "centre"
                  ? "center"
                  : props.align === "right"
                  ? "flex-end"
                  : props.align === "left"
                  ? "flex-start"
                  : "stretch",
                { wrap: true }
              )
            )
          );

        return WithStyles(<slot />, css);
      }
    );
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    return WithStyles(
      <slot />,
      Css.Init().With(
        Rule.Init(":host")
          .With(new Grid(parseInt(props.cols ?? "12"), CT.padding.block.X))
          .With(
            props.flush
              ? new Padding("margin", "0")
              : CT.padding.block.AsMargin().YOnly()
          )
          .With(
            "height",
            props.fill ? (props.fill === "screen" ? "100vh" : "100%") : "auto"
          )
      )
    );
  }
}
