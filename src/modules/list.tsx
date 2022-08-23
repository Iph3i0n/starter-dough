import { h } from "preact";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import { CT } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";

const Props = {
  variant: IsOneOf("ordered", "unordered"),
  align: Optional(IsOneOf("left", "right", "center")),
  "no-margin": Optional(IsLiteral(true)),
};

export default class List extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
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
      h(tag, { class: "list" }, <slot />),
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
}
