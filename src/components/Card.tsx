import Jsx from "Src/Jsx";
import { IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import { CT } from "Src/Theme";

Define(
  "p-card",
  {
    title: Optional(IsString),
    img: Optional(IsString),
    "img-alt": Optional(IsString),
  },
  {},
  {
    render() {
      return (
        <div class="card">
          {"img" in this.props && (
            <img
              src={this.props.img}
              alt={this.props["img-alt"]}
              class="card-img-top"
            />
          )}
          <div class="card-body">
            {this.props.title && <h5 class="card-title">{this.props.title}</h5>}
            <slot />
          </div>
        </div>
      );
    },
    css() {
      return {
        ".card": {
          background: CT.colours.bg_surface.Hex,
          borderRadius: CT.border.radius,
          overflow: "hidden",
          border: CT.border.standard_borders,
          boxShadow: CT.border.standard_box_shadow,
          position: "relative",
        },
        ".card .card-img-top": {
          display: "block",
          maxWidth: "100%",
          width: "100%",
          objectFit: "cover",
          background: CT.colours.bg_dark.Hex,
          color: CT.colours.body_white.Hex,
          fontFamily: CT.text.font_family,
          textAlign: "center",
          border: "none",
          borderBottom: CT.border.standard_borders,
        },
        ".card .card-body": {
          padding: CT.padding.block,
        },
        ".card .card-title": {
          fontSize: CT.text.size.body_large,
          fontFamily: CT.text.font_family,
          margin: `0 0 ${CT.padding.block}`,
        },
      };
    },
  }
);
