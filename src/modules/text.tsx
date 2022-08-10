import { h } from "preact";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import { CT, TextVariants } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";

const Props = {
  align: Optional(IsOneOf("left", "right", "center")),
  "no-margin": Optional(IsLiteral(true)),
  variant: IsOneOf(...TextVariants),
};

export default class Text extends PreactComponent<typeof Props> {
  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    let target = CT.text[props.variant];
    if (props["no-margin"])
      target = target.WithPadding(new Padding("margin", "0"));

    return WithStyles(
      h(target.Tag, { class: "text" }, <slot />),
      Css.Init().With(
        Rule.Init(".text")
          .With(target)
          .With("text-align", props.align ?? "left")
      )
    );
  }
}
