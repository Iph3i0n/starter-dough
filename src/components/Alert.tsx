import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, FromText, GetColour } from "Src/Theme";
import { IsLiteral, Optional } from "@paulpopat/safe-type";

Define(
  "p-alert",
  { colour: IsOneOf(...ColourNames), dismissable: Optional(IsLiteral(true)) },
  { open: true },
  {
    render() {
      return (
        <>
          {this.state.open && (
            <div class="alert">
              <div>
                <slot />
              </div>
              {this.props.dismissable && (
                <div
                  class="close-button"
                  on_click={() => this.set_state({ open: false })}
                >
                  <p-icon name="close" size="2rem" colour="light" />
                </div>
              )}
            </div>
          )}
        </>
      );
    },
    css() {
      const colour = GetColour(this.props.colour);
      return {
        ".alert": {
          backgroundColor: colour,
          color: FromText(colour?.Text),
          padding: CT.padding.block,
          fontFamily: CT.text.font_family,
          lineHeight: CT.text.line_height,
          fontSize: CT.text.size.body_large,
          fontWeight: CT.text.weight.body,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: CT.border.radius,
          border: CT.border.standard_borders,
          boxShadow: CT.border.standard_box_shadow,
          position: "relative",
        },
        ".close-button": {
          cursor: "pointer",
          transition: `opacity ${CT.animation.time_fast}`,
          opacity: "1",
        },
        ".close-button:hover": {
          opacity: "0.5",
        },
      };
    },
  }
);
