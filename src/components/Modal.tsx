import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Jsx from "Src/Jsx";
import { CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";

Define(
  "p-modal",
  { hash: IsString, large: Optional(IsLiteral(true)) },
  { open: false },
  {
    render() {
      this.listen("load", function () {
        const is_open = () => window.location.hash === "#" + this.props.hash;
        this.set_state({ open: is_open() });

        window.addEventListener("hashchange", () =>
          this.set_state({ open: is_open() })
        );
      });

      return (
        <section class={C("modal-container", ["open", this.state.open])}>
          <div class="modal-backdrop" />
          <div class="modal">
            <a class="close-button" href="#">
              <p-icon name="close" size="2rem" colour="dark" />
            </a>
          </div>
        </section>
      );
    },
    css() {
      return {
        ".modal-container": {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          opacity: "0",
          zIndex: "999",
          transition: `opacity ${CT.animation.time_slow}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        },
        ".modal-container.open": {
          opacity: "1",
          pointerEvents: "auto",
        },
        ".modal-backdrop": {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          opacity: "0.7",
          background: GetColour(CT.colours.bg_surface),
        },
        ".modal": {
          position: "relative",
          width: "100%",
          height: "100%",
          maxWidth: this.props.large ? "60rem" : "40rem",
          maxHeight: this.props.large ? "40rem" : "30rem",
          overflow: "auto",
          margin: CT.padding.block,
          padding: CT.padding.block,
          background: GetColour(CT.colours.bg_white),
          boxShadow: CT.border.standard_box_shadow,
          border: CT.border.standard_borders,
          borderRadius: CT.border.radius,
          transition: `transform ${CT.animation.time_slow}`,
          transform: "translate(0, -5rem)",
        },
        ".open .modal": {
          transform: "translate(0, 0)",
        },
        ".close-button": {
          position: "absolute",
          top: CT.padding.block,
          right: CT.padding.block,
          cursor: "pointer",
          transition: `opacity ${CT.animation.time_fast}`,
          opacity: "1",
          textDecoration: "none",
        },
        ".close-button:hover": {
          opacity: "0.5",
        },
      };
    },
  }
);
