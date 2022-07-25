import { IsLiteral, IsString, IsUnion, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Css, { Rule } from "Src/CSS";
import Jsx from "Src/Jsx";
import Padding from "Src/styles/Padding";
import Transition from "Src/styles/Transition";
import { CT, TextVariants } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";

const IsTypographBase = {
  align: Optional(
    IsUnion(IsLiteral("left"), IsLiteral("center"), IsLiteral("right"))
  ),
  "no-margin": Optional(IsLiteral(true)),
};

Define(
  "p-text",
  {
    ...IsTypographBase,
    variant: IsOneOf(...TextVariants),
  },
  {},
  {
    render() {
      return Jsx.Element(
        ("h" + CT.text[this.Props.variant].Tag) as any,
        { class: "text" },
        <slot />
      );
    },
    css() {
      let target = CT.text[this.Props.variant];
      if (this.Props["no-margin"])
        target = target.WithPadding(new Padding("margin", "0"));

      return Css.Init().With(
        Rule.Init(".text")
          .With(target)
          .With("text-align", this.Props.align ?? "left")
      );
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
        switch (this.Props.variant) {
          case "ordered":
            return "ol" as const;
          case "unordered":
            return "ul" as const;
        }
      })();
      return Jsx.Element(tag, { class: "list" }, <slot />);
    },
    css() {
      return Css.Init().With(
        Rule.Init(".list")
          .With(CT.text.body.WithPadding(new Padding("margin", "0")))
          .With(CT.padding.block.LeftOnly())
          .With("text-align", this.Props.align ?? "left")
          .With(
            "margin-bottom",
            this.Props["no-margin"] ? "0" : CT.text.body.Padding.Bottom
          )
          .With("child", Rule.Init(".list").With("margin-bottom", "0"))
      );
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

Define(
  "p-link",
  {
    href: Optional(IsString),
  },
  {},
  {
    render() {
      return (
        <a {...this.Props}>
          <slot />
        </a>
      );
    },
    css() {
      return Css.Init().With(
        Rule.Init("a")
          .With(
            "disabled" in this.Props
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
      );
    },
  }
);
