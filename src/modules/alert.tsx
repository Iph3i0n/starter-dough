import { ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { useState } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import { IsOneOf } from "Src/utils/Type";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import { JSX } from "preact/jsx-runtime";

const Props = {
  colour: IsOneOf(...ColourNames),
  dismissable: Optional(IsLiteral(true)),
};

export default class Alert extends PreactComponent<typeof Props> {
  protected Render({
    dismissable,
    colour,
  }: FromProps<typeof Props>): JSX.Element {
    const [open, set_open] = useState(true);

    if (open) return <></>;

    return WithStyles(
      <div class="alert">
        <div>
          <slot />
        </div>
        {dismissable && (
          <div class="close-button" onClick={() => set_open(false)}>
            <p-icon name="close" size="2rem" colour={colour} text />
          </div>
        )}
      </div>,
      Css.Init()
        .With(
          Rule.Init(".alert")
            .With(GetColour(colour))
            .With(CT.padding.block)
            .With(CT.text.body_large)
            .With(new Flex("center", "sspace-between"))
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
        )
        .With(
          Rule.Init(".close-button")
            .With("cursor", "pointer")
            .With("opacity", "1")
            .With(new Transition("fast", "opacity"))
        )
        .With(Rule.Init(".close-button:hover").With("opacity", "0.5"))
    );
  }

  protected override IsProps = Props;
}
