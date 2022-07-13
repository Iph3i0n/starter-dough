import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, FromText, GetColour } from "Src/Theme";

Define(
  "p-alert",
  { colour: IsOneOf(...ColourNames) },
  {},
  {
    render() {
      return <slot />;
    },
    css() {
      const colour = GetColour(this.props.colour);
      return {
        ":host": {
          backgroundColor: colour,
          color: FromText(colour?.Text),
          padding: CT.padding.block,
          fontFamily: CT.text.font_family,
          lineHeight: CT.text.line_height,
          fontSize: CT.text.size.body_large,
          fontWeight: CT.text.weight.body,
          display: "block",
          textAlign: "left",
          borderRadius: CT.border.radius,
        },
      };
    },
  }
);
