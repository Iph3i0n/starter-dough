import Register from "Src/Register";
import { h } from "preact";
import { IsLiteral, IsString, IsUnion, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import Transition from "Src/styles/Transition";
import {
  ColourNames,
  CT,
  GetColour,
  TextVariant,
  TextVariants,
} from "Src/Theme";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { useEffect, useState } from "preact/hooks";
import { GetComponent } from "Src/utils/Html";

declare global {
  type TypographyBase = {
    align?: "left" | "center" | "right";
    "no-margin"?: true;
  };
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      ["p-text"]: CustomElement<
        TypographyBase & { variant: TextVariant; style?: string }
      >;
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

Register(
  "p-code",
  { language: Optional(IsString), colour: Optional(IsOneOf(...ColourNames)) },
  function (props) {
    const [html, set_html] = useState("");
    const colour = GetColour(props.colour ?? "surface");

    useEffect(() => {
      import("highlight.js").then((hljs) =>
        set_html(
          props.language
            ? hljs.default.highlight(
                props.language,
                GetComponent(this)?.textContent ?? ""
              ).value
            : hljs.default.highlight(
                GetComponent(this)?.textContent ?? "",
                undefined as any
              ).value
        )
      );
    }, [props.children, props.language, this.base]);

    return WithStyles(
      <code dangerouslySetInnerHTML={{ __html: html }} />,
      Css.Init().With(
        Rule.Init("code")
          .With("white-space", "pre-wrap")
          .With("display", "block")
          .With(colour)
          .With(CT.padding.small_block)
          .With(CT.box_shadow.small)
          .With(CT.border.small)
          .With(
            "child",
            Rule.Init(".hljs-keyword").With(CT.colours.danger.AsText())
          )
          .With(
            "child",
            Rule.Init(".hljs-built_in,.hljs-property").With(
              CT.colours.warning.AsText()
            )
          )
          .With(
            "child",
            Rule.Init(".hljs-type").With(CT.colours.primary.AsText())
          )
          .With(
            "child",
            Rule.Init(".hljs-literal,.hljs-number").With(
              CT.colours.info.AsText()
            )
          )
          .With(
            "child",
            Rule.Init(".hljs-string").With(CT.colours.success.AsText())
          )
          .With(
            "child",
            Rule.Init(".hljs-comment,.hljs-operator,.hljs-punctuation,.hljs-params").With(
              CT.colours.faded_text
            )
          )
      )
    );
  }
);
