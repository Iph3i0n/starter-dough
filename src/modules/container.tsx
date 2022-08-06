import { Sizes, CT } from "Src/Theme";
import Css, { Media, Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  {
    "full-width": Optional(IsLiteral(true)),
    flush: Optional(IsLiteral(true)),
    fill: Optional(IsLiteral(true)),
  },
  (props) => {
    let section = Rule.Init(":host")
      .With("display", "block")
      .With("margin", "auto")
      .With("max-width", "100%")
      .With("height", props.fill ? "100vh" : "100%")
      .With("box-sizing", "border-box")
      .With(props.flush ? new Padding("padding", "0") : CT.padding.block);
    let css: Css = Css.Init()
      .With(section)
      .With(Rule.Init(":host(.full-width)").With("max-width", "100%"));

    for (const size of Sizes) {
      css = css.With(
        Media.Init("min-width", CT.screen[size].breakpoint).With(
          Rule.Init(":host(:not(.full-width))").With(
            "max-width",
            CT.screen[size].width
          )
        )
      );
    }

    return WithStyles(<>{props.children}</>, css);
  }
);
