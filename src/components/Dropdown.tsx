import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString } from "@paulpopat/safe-type";
import { IsHtmlElement } from "Src/utils/Type";
import { GetMousePosition } from "Src/utils/Mouse";
import { CT, FromText, GetColour } from "Src/Theme";

Define(
  "p-dropdown",
  { target: IsString },
  { open: false, position: [-1, -1] as readonly [number, number] },
  {
    render() {
      this.listen("load", () =>
        document.addEventListener("click", (e) => {
          const target: Node | null = e.target as any;
          if (
            !target ||
            !IsHtmlElement(target) ||
            target.id !== this.props.target
          )
            this.set_state({ ...this.state, open: false });
          else this.set_state({ open: true, position: GetMousePosition() });
        })
      );

      if (this.state.open)
        return (
          <div>
            <slot />
          </div>
        );
      return <></>;
    },
    css() {
      const [x, y] = this.state.position;
      return {
        div: {
          position: "fixed",
          top: y.toString() + "px",
          left: x.toString() + "px",
          background: GetColour(CT.colours.bg_surface),
          borderRadius: CT.border.radius,
          border: CT.border.standard_borders,
          boxShadow: CT.border.standard_box_shadow,
          animationDuration: CT.animation.time_fast,
          animationName: "fade-in",
          margin: "0",
          overflow: "hidden",
          minWidth: "10rem",
        },
        "@keyframes fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      };
    },
  }
);

Define(
  "p-dropdown-item",
  { "on-click": IsString },
  {},
  {
    render() {
      const on_click = (window as any)[this.props["on-click"]] ?? (() => {});

      return (
        <button type="button" on_click={(e: any) => on_click(e)}>
          <slot />
        </button>
      );
    },
    css() {
      return {
        button: {
          padding: CT.padding.block,
          cursor: "pointer",
          background: GetColour(CT.colours.bg_surface),
          color: FromText(GetColour(CT.colours.bg_surface)),
          fontFamily: CT.text.font_family,
          fontSize: CT.text.size.body,
          fontWeight: CT.text.weight.body,
          lineHeight: CT.text.line_height,
          transition: `background-color ${CT.animation.time_fast}, color ${CT.animation.time_fast}`,
          display: "block",
          border: "none",
          boxShadow: "none",
          margin: "0",
          width: "100%",
          textAlign: "left",
        },
        "button:hover": {
          backgroundColor: GetColour(CT.colours.bg_dark),
          color: FromText(GetColour(CT.colours.bg_dark)),
        },
      };
    },
  }
);

Define(
  "p-dropdown-divider",
  {},
  {},
  {
    render() {
      return <hr />;
    },
    css() {
      return {
        hr: {
          display: "block",
          border: "none",
          boxShadow: "none",
          margin: "0",
          width: "100%",
          borderBottom: `${CT.border.width} solid ${GetColour(
            CT.colours.body_dark
          )}`,
        },
      };
    },
  }
);
