import WithStyles from "Src/utils/Styles";
import { IsString, Optional } from "@paulpopat/safe-type";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { UseIndex, WithIndex } from "Src/utils/Index";
import WithChild from "Src/contexts/WithChild";
import NavStyles from "Src/rules/Nav";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  {},
  WithChild(
    WithIndex((props) => WithStyles(<nav>{props.children}</nav>, NavStyles)),
    { href: Optional(IsString), id: Optional(IsString) },
    (props) => {
      const { index, total } = UseIndex();
      return WithStyles(
        <>
          {props.href ? (
            <a href={props.href} id={props.id ?? undefined}>
              {props.children}
            </a>
          ) : (
            <span id={props.id ?? undefined}>{props.children}</span>
          )}
          {index !== total - 1 && <>/</>}
        </>,
        Css.Init()
          .With(Rule.Init(":host").With("display", "inline-block"))
          .With(
            Rule.Init("a, span")
              .With("display", "inline-block")
              .With(CT.padding.input)
              .With("margin", "0")
              .With(
                "modifier",
                Rule.Init(":first-child").With("margin-left", "0")
              )
              .With(
                "modifier",
                Rule.Init(":last-child").With("margin-right", "0")
              )
          )
          .With(
            Rule.Init("a")
              .With(CT.colours.primary.AsText())
              .With("text-decoration", "none")
          )
          .With(Rule.Init("span").With(CT.colours.faded_text))
      );
    }
  )
);
