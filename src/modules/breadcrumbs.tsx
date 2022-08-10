import WithStyles from "Src/utils/Styles";
import { IsString, Optional } from "@paulpopat/safe-type";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import NavStyles from "Src/rules/Nav";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import { JSX } from "preact/jsx-runtime";

export default class Breadcrumbs extends PreactComponent {
  public constructor() {
    super();

    this.SetChild(
      { href: Optional(IsString), id: Optional(IsString) },
      function (props) {
        return WithStyles(
          <>
            {props.href ? (
              <a href={props.href} id={props.id ?? undefined}>
                <slot />
              </a>
            ) : (
              <span id={props.id ?? undefined}>
                <slot />
              </span>
            )}
            {!this.LastChild && <>/</>}
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
    );
  }

  protected Render(props: FromProps<{}>, state: {}): JSX.Element {
    return WithStyles(
      <nav>
        <slot />
      </nav>,
      NavStyles
    );
  }
  protected IsProps = {};
}
