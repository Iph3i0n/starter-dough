import { h } from "preact";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import Css, { CssProperty, Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import { CT, Sizes, TextVariants } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import Object from "Src/utils/Object";

const Props = {
  align: Optional(IsOneOf("left", "right", "center")),
  "no-margin": Optional(IsLiteral(true)),
  variant: IsOneOf(...TextVariants),
  ...Object.MapArrayAsKeys(Sizes, () => Optional(IsOneOf(...TextVariants))),
};

export default class Text extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    let rule = Rule.Init(".text").With("text-align", props.align ?? "left");

    let target = CT.text[props.variant];
    if (props["no-margin"])
      target = target.WithPadding(new Padding("margin", "0"));

    rule = rule.With(target);

    for (const size of Sizes) {
      const variant = props[size];
      if (!variant) continue;
      let target = CT.text[variant];
      if (props["no-margin"])
        target = target.WithPadding(new Padding("margin", "0"));

      rule = rule.With(
        target.WithMedia("min-width", CT.screen[size].breakpoint)
      );
    }

    return WithStyles(
      h(target.Tag, { class: "text" }, <slot />),
      Css.Init().With(rule)
    );
  }
}
