import Register from "Src/Register";
import { h, Fragment } from "preact";
import { CustomElement } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import { ColourName, ColourNames, CT, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import Padding from "Src/styles/Padding";
import Css, { Rule } from "Src/CSS";
import Border from "Src/styles/Border";
import BoxShadow from "Src/styles/BoxShadow";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { UseIndex, WithIndex } from "Src/utils/Index";
import WithChild from "./Child";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      "p-list-group": CustomElement<{ flush?: true }>;
      "p-list-group-item": CustomElement<{
        colour?: ColourName;
        disabled?: true;
        href?: string;
        target?: string;
      }>;
    }
  }
}

Register(
  "p-list-group",
  { flush: Optional(IsLiteral(true)) },
  WithChild(
    WithIndex((props) =>
      WithStyles(
        <>{props.children}</>,
        Css.Init().With(
          Rule.Init(":host")
            .With("display", "block")
            .With("padding", "0")
            .With("margin", "0")
            .With(props.flush ? new Border({}) : CT.border.standard)
            .With(
              props.flush ? new BoxShadow({ blur: "0" }) : CT.box_shadow.large
            )
            .With("overflow", "hidden")
            .With("width", "100%")
        )
      )
    ),
    {
      colour: Optional(IsOneOf(...ColourNames)),
      disabled: Optional(IsLiteral(true)),
      href: Optional(IsString),
      target: Optional(IsString),
    },
    (props) => {
      const background = props.colour
        ? GetColour(props.colour)
        : CT.colours.surface;
      const hover_background = background.GreyscaleTransform(140, true);
      const { index } = UseIndex();
      const css = Css.Init()
        .With(
          Rule.Init("span, a")
            .With(new Flex("center", "space-between"))
            .With(
              new Padding("padding", CT.text.body.Padding.Y, CT.padding.block.X)
            )
            .With(CT.text.body)
            .With("margin", "0")
            .With(
              index === 0
                ? new Border({})
                : CT.border.standard.WithDirection("top").WithRadius("0")
            )
            .With(background)
            .With("opacity", props.disabled ? "0.5" : "1")
            .With(
              new Transition("fast", "background-color", "color", "opacity")
            )
        )
        .With(
          Rule.Init("a")
            .With("cursor", "pointer")
            .With("text-decoration", "none")
        )
        .With(Rule.Init("a:hover").With(hover_background));

      if (props.href)
        return WithStyles(
          <a href={props.href} target={props.target ?? undefined}>
            {props.children}
          </a>,
          css
        );

      return WithStyles(<span>{props.children}</span>, css);
    }
  )
);
