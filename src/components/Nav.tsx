import Register from "Src/Register";
import { h, Fragment } from "preact";
import { CustomElement } from "Src/utils/Type";
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
import { UseIndex, WithIndex } from "Src/utils/Index";
import { useContext, useEffect, useState } from "preact/hooks";
import WithChild from "./Child";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      "p-breadcrumbs": CustomElement<{}>;
    }
  }
}

const NavStyles = Css.Init().With(
  Rule.Init("nav")
    .With(new Flex("center", "flex-start"))
    .With(CT.text.body_large)
    .With("width", "100%")
);

Register(
  "p-breadcrumbs",
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

Register(
  "p-nav",
  {
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
  },
  WithChild(
    (props) =>
      WithStyles(
        <nav>
          {props.children}
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
      ),
    {
      href: Optional(IsString),
      id: Optional(IsString),
      spy: Optional(IsString),
    },
    (props) => {
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
              {props.children}
            </a>
          ) : (
            <span class={C(["active", active])} id={props.id ?? undefined}>
              {props.children}
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
  )
);
