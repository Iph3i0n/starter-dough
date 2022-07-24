import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";

Define(
  "p-alert",
  { colour: IsOneOf(...ColourNames), dismissable: Optional(IsLiteral(true)) },
  { open: true },
  {
    render() {
      return (
        <>
          {this.State.open && (
            <div class="alert">
              <div>
                <slot />
              </div>
              {this.Props.dismissable && (
                <div
                  class="close-button"
                  on_click={() => this.State = ({ open: false })}
                >
                  <p-icon
                    name="close"
                    size="2rem"
                    colour={this.Props.colour}
                    text
                  />
                </div>
              )}
            </div>
          )}
        </>
      );
    },
    css() {
      return Css.Init()
        .With(
          Rule.Init(".alert")
            .With(GetColour(this.Props.colour))
            .With(CT.padding.block)
            .With(CT.text.body_large)
            .With(new Flex("center", "space-between"))
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
        )
        .With(
          Rule.Init(".close-button")
            .With("cursor", "pointer")
            .With("opacity", "1")
            .With(new Transition("fast", "opacity"))
        )
        .With(Rule.Init(".close-button:hover").With("opacity", "0.5"));
    },
  }
);
