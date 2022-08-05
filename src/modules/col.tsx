import { Sizes, CT } from "Src/Theme";
import Css, { Media, Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Object from "Src/utils/Object";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  {
    ...Object.MapArrayAsKeys(Sizes, () => Optional(IsString)),
    centre: Optional(IsLiteral(true)),
    align: Optional(IsOneOf("centre", "right", "left")),
  },
  (props) => {
    let css = Css.Init();

    for (const size of Sizes) {
      if (props[size])
        css = css.With(
          Media.Init("min-width", CT.screen[size].breakpoint).With(
            Rule.Init(":host").With("grid-column", "auto / span " + props[size])
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

    return WithStyles(<>{props.children}</>, css);
  }
);
