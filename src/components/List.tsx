import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import { ColourNames, CT, FromText, GetColour } from "Src/Theme";
import { Pad, Trans } from "Src/utils/Class";
import { IsFirstChild } from "Src/utils/Html";
import { IsOneOf } from "Src/utils/Type";

Define(
  "p-list-group",
  { flush: Optional(IsLiteral(true)) },
  {},
  {
    render() {
      return <slot />;
    },
    css() {
      return {
        ":host": {
          display: "block",
          padding: "0",
          margin: "0",
          border: this.props.flush ? "none" : CT.border.standard_borders,
          boxShadow: this.props.flush ? "none" : CT.border.standard_box_shadow,
          borderRadius: CT.border.radius,
          overflow: "hidden",
        },
      };
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
      const background = GetColour(this.props.colour ?? CT.colours.bg_white);
      const hover_background = background.GreyscaleTransform(140);
      return {
        "span, a": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: Pad(CT.padding.text_sm, CT.padding.block),
          margin: "0",
          border: "none",
          borderTop: !IsFirstChild(this.ele)
            ? CT.border.standard_borders
            : "none",
          fontSize: CT.text.size.body,
          fontFamily: CT.text.font_family,
          fontWeight: CT.text.weight.body,
          lineHeight: CT.text.line_height,
          background: background,
          color: FromText(background),
          opacity: this.props.disabled ? "0.5" : "1",
          transition: Trans(
            CT.animation.time_fast,
            "background-color",
            "color"
          ),
        },
        a: {
          cursor: "pointer",
          textDecoration: "none",
        },
        "a:hover": {
          backgroundColor: hover_background,
          color: FromText(hover_background),
        },
      };
    },
  }
);
