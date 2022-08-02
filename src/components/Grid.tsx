import Register from "Src/Register";
import { Fragment } from "preact";
import { Sizes, CT, Size } from "Src/Theme";
import Css, { Media, Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import Grid from "Src/styles/Grid";
import Flex from "Src/styles/Flex";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Object from "Src/utils/Object";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      "p-container": CustomElement<{ "full-width"?: true; flush?: true }>;
      "p-row": CustomElement<{ cols?: string; flush?: true }>;
      "p-col": CustomElement<
        Partial<Record<Size, string>> & {
          centre?: true;
          align?: "left" | "centre" | "right";
        }
      >;
    }
  }
}

Register(
  "p-container",
  { "full-width": Optional(IsLiteral(true)), flush: Optional(IsLiteral(true)) },
  (props) => {
    let section = Rule.Init(":host")
      .With("display", "block")
      .With("margin", "auto")
      .With("max-width", "100%")
      .With(props.flush ? new Padding("padding", "0") : CT.padding.block);
    let css: Css = Css.Init()
      .With(section)
      .With(Rule.Init(":host(.full-width)").With("max-width", "100%"));

    for (const size of Sizes) {
      css = css.With(
        Media.Init(`min-width: ${CT.screen[size].breakpoint}`).With(
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

Register(
  "p-row",
  { cols: Optional(IsString), flush: Optional(IsLiteral(true)) },
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
      )
    )
);

Register(
  "p-col",
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
          Media.Init(`min-width: ${CT.screen[size].breakpoint}`).With(
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
