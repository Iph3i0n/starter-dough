import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import Padding from "Src/styles/Padding";
import Css, { Rule } from "Src/CSS";
import Border from "Src/styles/Border";
import BoxShadow from "Src/styles/BoxShadow";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { IsFirstChild } from "Src/utils/Html";

Define(
  "p-list-group",
  { flush: Optional(IsLiteral(true)) },
  {},
  {
    render() {
      return <slot />;
    },
    css() {
      return Css.Init().With(
        Rule.Init(":host")
          .With("display", "block")
          .With("padding", "0")
          .With("margin", "0")
          .With(this.props.flush ? new Border({}) : CT.border.standard)
          .With(
            this.props.flush
              ? new BoxShadow({ blur: "0" })
              : CT.box_shadow.large
          )
          .With("overflow", "hidden")
          .With("width", "100%")
      );
    },
  }
);

Define(
  "p-list-group-item",
  {
    colour: Optional(IsOneOf(...ColourNames)),
    disabled: Optional(IsLiteral(true)),
    href: Optional(IsString),
    target: Optional(IsString),
  },
  {},
  {
    render() {
      if (this.props.href)
        return (
          <a href={this.props.href} target={this.props.target}>
            <slot />
          </a>
        );

      return (
        <span>
          <slot />
        </span>
      );
    },
    css() {
      const background = this.props.colour
        ? GetColour(this.props.colour)
        : CT.colours.body;
      const hover_background = background.GreyscaleTransform(140);
      return Css.Init()
        .With(
          Rule.Init("span, a")
            .With(new Flex("center", "space-between"))
            .With(
              new Padding("padding", CT.text.body.Padding.Y, CT.padding.block.X)
            )
            .With(CT.text.body)
            .With("margin", "0")
            .With(
              IsFirstChild(this.ele)
                ? new Border({})
                : CT.border.standard.WithDirection(["top"]).WithRadius("0")
            )
            .With(background)
            .With("opacity", this.props.disabled ? "0.5" : "1")
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
    },
  }
);
