import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, FromText, GetColour } from "Src/Theme";
import { IsLiteral, Optional } from "@paulpopat/safe-type";

Define(
  "p-badge",
  { colour: IsOneOf(...ColourNames), "top-right": Optional(IsLiteral(true)) },
  { open: true },
  {
    render() {
      return <slot />;
    },
    css() {
      const colour = GetColour(this.props.colour);
      return {
        ":host": {
          backgroundColor: colour,
          color: FromText(colour),
          padding: `${CT.padding.badge} ${CT.padding.text_sm}`,
          display: "inline-block",
          borderRadius: CT.border.radius,
          ...(this.props["top-right"]
            ? {
                position: "absolute",
                top: "0",
                right: "0",
                transform: `translate(50%, -50%)`,
                boxShadow: CT.border.standard_box_shadow,
              }
            : {}),
        },
      };
    },
  }
);
