import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import { CT } from "Src/Theme";
import WithStyles from "Src/utils/Styles";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  {
    href: IsString,
    target: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
  },
  (props) =>
    WithStyles(
      <a href={props.href} target={props.target ?? undefined}>
        {props.children}
      </a>,
      Css.Init().With(
        Rule.Init("a")
          .With(
            "disabled" in props
              ? CT.colours.primary.AsText()
              : CT.colours.faded_text
          )
          .With("opacity", "1")
          .With(new Transition("fast", "opacity"))
          .With(
            "modifier",
            Rule.Init(":hover")
              .With("opacity", "0.7")
              .With("text-deoration", "underline")
          )
          .With("text-decoration", "none")
          .With("cursor", "pointer")
      )
    )
);
