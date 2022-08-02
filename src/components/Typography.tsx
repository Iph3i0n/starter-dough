import Register from "Src/Register";
import { h } from "preact";
import { IsLiteral, IsString, IsUnion, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import Transition from "Src/styles/Transition";
import { CT, TextVariant, TextVariants } from "Src/Theme";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";

declare global {
  type TypographyBase = {
    align?: "left" | "center" | "right";
    "no-margin"?: true;
  };
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      ["p-text"]: CustomElement<TypographyBase & { variant: TextVariant }>;
      ["p-list"]: CustomElement<
        TypographyBase & {
          variant: "ordered" | "unordered";
          data: (string | string[])[];
        }
      >;
      ["p-item"]: CustomElement<{}>;
      ["p-link"]: CustomElement<{ href: string }>;
    }
  }
}

Register(
  "p-text",
  {
    align: Optional(IsOneOf("left", "right", "center")),
    "no-margin": Optional(IsLiteral(true)),
    variant: IsOneOf(...TextVariants),
  },
  (props) => {
    let target = CT.text[props.variant];
    if (props["no-margin"])
      target = target.WithPadding(new Padding("margin", "0"));

    return WithStyles(
      h(target.Tag, { class: "text" }, props.children),
      Css.Init().With(
        Rule.Init(".text")
          .With(target)
          .With("text-align", props.align ?? "left")
      )
    );
  }
);

Register(
  "p-list",
  {
    data: IsString,
    variant: IsOneOf("ordered", "unordered"),
    align: Optional(IsOneOf("left", "right", "center")),
    "no-margin": Optional(IsLiteral(true)),
  },
  (props) => {
    const tag = (() => {
      switch (props.variant) {
        case "ordered":
          return "ol" as const;
        case "unordered":
        default:
          return "ul" as const;
      }
    })();

    return WithStyles(
      h(
        tag,
        { class: "list" },
        ...props.data
          .split(",")
          .map((item: string, index: number) => <li key={index}>{item}</li>)
      ),
      Css.Init().With(
        Rule.Init(".list")
          .With(CT.text.body.WithPadding(new Padding("margin", "0")))
          .With(CT.padding.block.LeftOnly())
          .With("text-align", props.align ?? "left")
          .With(
            "margin-bottom",
            props["no-margin"] ? "0" : CT.text.body.Padding.Bottom
          )
          .With("child", Rule.Init(".list").With("margin-bottom", "0"))
      )
    );
  }
);

Register(
  "p-link",
  {
    href: IsString,
    target: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
  },
  (props) =>
    WithStyles(
      <a href={props.href} target={props.target ?? undefined}>
        {props.children}
      </a>,
      Css.Init().With(
        Rule.Init("a")
          .With(
            "disabled" in props
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
      )
    )
);
