import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import Grid from "Src/styles/Grid";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import BuildComponent from "Src/BuildComponent";
import { IsOneOf } from "Src/utils/Type";

export default BuildComponent(
  {
    cols: Optional(IsString),
    flush: Optional(IsLiteral(true)),
    fill: Optional(IsOneOf("screen", "container")),
  },
  (props) =>
    WithStyles(
      <>{props.children}</>,
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
    )
);
