import WithStyles from "Src/utils/Styles";
import {
  IsLiteral,
  IsString,
  IsUnion,
  Optional,
  PatternMatch,
} from "@paulpopat/safe-type";
import { IsVisible } from "Src/utils/Html";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import C from "Src/utils/Class";
import { useEffect, useState } from "preact/hooks";
import NavStyles from "Src/rules/Nav";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";

const Props = {
  align: Optional(
    IsUnion(
      IsLiteral("left"),
      IsLiteral("centre"),
      IsLiteral("right"),
      IsLiteral("spread")
    )
  ),
  column: Optional(IsLiteral(true)),
  tabs: Optional(IsLiteral(true)),
};

export default class Nav extends PreactComponent<typeof Props> {
  public constructor() {
    super();
    this.SetChild(
      {
        href: Optional(IsString),
        id: Optional(IsString),
        spy: Optional(IsString),
      },
      function (props) {
        const [active, set_active] = useState(false);

        useEffect(() => {
          if (!props.spy) return;

          const handler = () => {
            set_active(IsVisible(document.querySelector(props.spy ?? "")));
          };

          document.addEventListener("scroll", handler);
          handler();

          return () => document.removeEventListener("scroll", handler);
        }, []);

        return WithStyles(
          <>
            {props.href ? (
              <a
                href={props.href}
                class={C(["active", active])}
                id={props.id ?? undefined}
              >
                <slot />
              </a>
            ) : (
              <span class={C(["active", active])} id={props.id ?? undefined}>
                <slot />
              </span>
            )}
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
                .With(
                  "modifier",
                  Rule.Init(".active")
                    .With(CT.colours.primary)
                    .With(CT.border.standard)
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

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    return WithStyles(
      <nav>
        <slot />
        <span class="spacer" />
      </nav>,
      NavStyles.With(
        Rule.Init("nav").With(
          new Flex(
            "flex-start",
            PatternMatch(
              IsLiteral("left"),
              IsLiteral("centre"),
              IsLiteral("right"),
              IsLiteral("spread")
            )(
              () => "flex-start",
              () => "center",
              () => "flex-end",
              () => "space-evenly"
            )(props.align ?? "left"),
            { direction: props.column ? "column" : "row" }
          )
        )
      )
        .With(Rule.Init(".spacer").With("align-self", "flex-end"))
        .With(
          props.tabs
            ? Rule.Init("a, span")
                .With(
                  CT.border.standard.WithRadius("0").WithDirection("bottom")
                )
                .With(
                  "modifier",
                  Rule.Init(".active")
                    .With(
                      CT.border.standard.WithDirection("top", "left", "right")
                    )
                    .With("border-bottom-left-radius", "0")
                    .With("border-bottom-right-radius", "0")
                )
                .With("modifier", Rule.Init(":last-child").With("flex", "1"))
            : Rule.Init("a")
        )
    );
  }
}
