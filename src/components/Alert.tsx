import Register from "Src/Register";
import { h, Fragment } from "preact";
import { ColourName, ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { useState } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import "./Icon";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import { IsLiteral, Optional } from "@paulpopat/safe-type";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      ["p-alert"]: CustomElement<
        { colour: ColourName; dismissable?: true },
        ""
      >;
    }
  }
}

Register(
  "p-alert",
  { colour: IsOneOf(...ColourNames), dismissable: Optional(IsLiteral(true)) },
  ({ colour, dismissable, children }) => {
    const [open, set_open] = useState(true);

    if (open) return <></>;

    return WithStyles(
      <div class="alert">
        <div>{children}</div>
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
);
