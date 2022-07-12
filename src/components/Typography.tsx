import { IsLiteral, IsUnion, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Jsx from "Src/Jsx";
import { CT } from "Src/Theme";
import C from "Src/utils/Class";

const IsTypographBase = {
  align: Optional(
    IsUnion(IsLiteral("left"), IsLiteral("center"), IsLiteral("right"))
  ),
  "no-margin": Optional(IsLiteral(true)),
};

Define(
  "p-heading",
  {
    ...IsTypographBase,
    level: IsUnion(
      IsLiteral("1"),
      IsLiteral("2"),
      IsLiteral("3"),
      IsLiteral("4"),
      IsLiteral("5"),
      IsLiteral("6")
    ),
    display: Optional(IsLiteral(true)),
  },
  {},
  {
    render() {
      return Jsx.Element(
        ("h" + this.props.level) as any,
        { class: C("heading", ["display", !!this.props.display]) },
        <slot />
      );
    },
    css() {
      return {
        ".heading": {
          fontSize: (CT.text.size as any)["h" + this.props.level],
          fontFamily: CT.text.font_family,
          fontWeight: CT.text.weight.heading,
          lineHeight: CT.text.line_height,
          margin: this.props["no-margin"] ? "0" : `0 0 ${CT.padding.text_lg}`,
          textAlign: this.props.align,
        },
        ".display": {
          fontSize: (CT.text.size as any)["display_h" + this.props.level],
          fontWeight: CT.text.weight.display,
        },
      };
    },
  }
);

Define(
  "p-body",
  {
    ...IsTypographBase,
    lead: Optional(IsLiteral(true)),
  },
  {},
  {
    render() {
      return (
        <p class={C("body", ["lead", !!this.props.lead])}>
          <slot />
        </p>
      );
    },
    css() {
      return {
        ".body": {
          fontSize: CT.text.size.body,
          fontFamily: CT.text.font_family,
          fontWeight: CT.text.weight.body,
          lineHeight: CT.text.line_height,
          margin: this.props["no-margin"] ? "0" : `0 0 ${CT.padding.text_sm}`,
          textAlign: this.props.align,
        },
        ".lead": {
          fontSize: CT.text.size.body_large,
        },
      };
    },
  }
);

Define(
  "p-list",
  {
    ...IsTypographBase,
    variant: IsUnion(IsLiteral("unordered"), IsLiteral("ordered")),
  },
  {},
  {
    render() {
      const tag = (() => {
        switch (this.props.variant) {
          case "ordered":
            return "ol" as const;
          case "unordered":
            return "ul" as const;
        }
      })();
      return Jsx.Element(tag, { class: "list" }, <slot />);
    },
    css() {
      return {
        ".list": {
          fontSize: CT.text.size.body,
          fontFamily: CT.text.font_family,
          fontWeight: CT.text.weight.body,
          lineHeight: CT.text.line_height,
          paddingLeft: CT.padding.block,
          marginBottom: this.props["no-margin"] ? "0" : CT.padding.text_sm,
          textAlign: this.props.align,
        },
        ".list .list": {
          marginBottom: "0",
        },
      };
    },
  }
);

Define(
  "p-item",
  {},
  {},
  {
    render() {
      return (
        <li>
          <slot />
        </li>
      );
    },
  }
);
