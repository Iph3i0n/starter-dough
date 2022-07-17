import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString, Optional } from "@paulpopat/safe-type";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, FromText, GetColour } from "Src/Theme";
import CreateContext from "Src/utils/Context";
import Colour from "Src/utils/Colour";

const Context = CreateContext(new Colour("#000000"));

Define(
  "p-navbar",
  { icon: IsString, bg: Optional(IsOneOf(...ColourNames)) },
  { open: false },
  {
    render() {
      return (
        <nav>
          <p-container flush>
            <p-row flush>
              <p-col xs="12" md="2" lg="1">
                <div class="icon-area">
                  <img src={this.props.icon} alt="" />
                </div>
              </p-col>
              <p-col xs="12" md="6" center>
                <slot />
              </p-col>
              <p-col xs="12" md="4" lg="5" align="right" center>
                <slot name="right" />
              </p-col>
            </p-row>
          </p-container>
        </nav>
      );
    },
    css() {
      const background = GetColour(this.props.bg ?? CT.colours.bg_surface);
      this.provide_context(Context, FromText(background));
      return {
        nav: {
          background: background,
          padding: CT.padding.block,
        },
        ".icon-area": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        img: {
          maxHeight: "3rem",
          borderRadius: CT.border.radius_sm,
        },
      };
    },
  }
);

Define(
  "p-navbar-item",
  { href: Optional(IsString), id: Optional(IsString) },
  {},
  {
    render() {
      if (this.props.href) {
        return (
          <a href={this.props.href} id={this.props.id}>
            <slot />
          </a>
        );
      }

      return (
        <span id={this.props.id}>
          <slot />
        </span>
      );
    },
    css() {
      const colour = this.use_context(Context);
      return {
        "a, span": {
          fontFamily: CT.text.font_family,
          fontSize: CT.text.size.h6,
          fontWeight: CT.text.weight.display,
          lineHeight: CT.text.line_height,
          textDecoration: "none",
          color: colour,
          userSelect: "none",
          cursor: "pointer",
        },
      };
    },
  }
);
