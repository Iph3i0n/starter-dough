import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString, Optional } from "@paulpopat/safe-type";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import CreateContext from "Src/utils/Context";
import Colour from "Src/styles/Colour";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";

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
                  <img src={this.Props.icon} alt="" />
                </div>
              </p-col>
              <p-col xs="12" md="6" centre>
                <slot />
              </p-col>
              <p-col xs="12" md="4" lg="5" align="right" centre>
                <slot name="right" />
              </p-col>
            </p-row>
          </p-container>
        </nav>
      );
    },
    css() {
      const colour = this.Props.bg
        ? GetColour(this.Props.bg)
        : CT.colours.surface;
      this.Provide(Context, colour);
      return Css.Init()
        .With(Rule.Init("nav").With(colour).With(CT.padding.block))
        .With(Rule.Init(".icon-area").With(new Flex("center", "space-between")))
        .With(
          Rule.Init("img")
            .With("max-height", "3rem")
            .With("border-radius", CT.border.small.Radius)
        );
    },
  }
);

Define(
  "p-navbar-item",
  { href: Optional(IsString), id: Optional(IsString) },
  {},
  {
    render() {
      if (this.Props.href) {
        return (
          <a href={this.Props.href} id={this.Props.id}>
            <slot />
          </a>
        );
      }

      return (
        <span id={this.Props.id}>
          <slot />
        </span>
      );
    },
    css() {
      const colour = this.Use(Context);
      return Css.Init().With(
        Rule.Init("a, span")
          .With(CT.text.h6)
          .With("text-decoration", "none")
          .With(new Colour([0, 0, 0, 0], colour.Text))
          .With("cursor", "pointer")
          .With("user-select", "none")
      );
    },
  }
);
