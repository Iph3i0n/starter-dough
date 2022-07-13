import Jsx from "Src/Jsx";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, FromText, GetColour } from "Src/Theme";
import { FormContext } from "./Form";
import { GetIndexOfParent, IsChildOf } from "Src/utils/Html";
import CreateContext from "Src/utils/Context";

const ButtonGroupContext = CreateContext(-1);

Define(
  "p-button",
  {
    colour: IsOneOf(...ColourNames),
    outline: Optional(IsLiteral(true)),
  },
  {},
  {
    render() {
      const props = this.props as any;
      if ("href" in props)
        return (
          <a {...props} class="button">
            <slot />
          </a>
        );

      if (props.type === "submit") {
        const { submit } = this.use_context(FormContext);
        return (
          <button {...props} class="button" on_click={(e: any) => submit()}>
            <slot />
          </button>
        );
      }

      const handler = props["on-click"];
      const on_click = handler ? (window as any)[handler] : () => {};
      return (
        <button {...props} class="button" on_click={(e: any) => on_click(e)}>
          <slot />
        </button>
      );
    },
    css() {
      const colour = GetColour(this.props.colour);
      if (!colour) throw new Error("Invalid colour");
      const [sharp_left, sharp_right] = (() => {
        const is_group = IsChildOf(this.ele, "p-button-group");
        if (!is_group) return [false, false];
        const length = this.use_context(ButtonGroupContext);
        const index = GetIndexOfParent(this.ele);
        return [index !== 0, index < length - 1];
      })();
      return {
        ".button": {
          fontSize: CT.text.size.body,
          padding: `${CT.padding.text_sm} ${CT.padding.text_lg}`,
          fontFamily: CT.text.font_family,
          display: "inline-block",
          borderRadius: CT.border.radius,
          margin: "0",
          transition: `background-color ${CT.animation.time_fast}, color ${CT.animation.time_fast}`,
          cursor: "pointer",
          userSelect: "none",
          border: "none",
          position: "relative",

          backgroundColor: this.props.outline ? "transparent" : colour.Hex,
          boxShadow: !this.props.outline
            ? CT.border.standard_box_shadow
            : `0 0 0 transparent, inset 0 0 0 ${CT.border.width} ${colour.Hex}`,
          color: this.props.outline ? colour.Hex : FromText(colour.Text),
          boxSizing: "border-box",

          ...(sharp_left
            ? {
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
              }
            : {}),
          ...(sharp_right
            ? {
                borderTopRightRadius: "0",
                borderBottomRightRadius: "0",
              }
            : {}),
        },
        ".button:hover": {
          backgroundColor: colour.GreyscaleTransform(120).Hex,
          color: CT.colours[colour.GreyscaleTransform(120).Text].Hex,
        },
      };
    },
  }
);

Define(
  "p-button-group",
  {},
  { children: -1 },
  {
    render() {
      this.provide_context(ButtonGroupContext, this.state.children);
      this.listen("children", function () {
        this.set_state({ children: this.child_elements.length });
      });
      return <slot />;
    },
    css() {
      return {
        ":host": {
          fontSize: "0",
        },
      };
    },
  }
);
