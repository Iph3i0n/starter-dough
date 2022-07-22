import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Css, { Rule } from "Src/CSS";
import Jsx from "Src/Jsx";
import Absolute from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { ColourNames, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import { IsOneOf } from "Src/utils/Type";

const SharedStyles = Css.Init()
  .With(
    Rule.Init(".container")
      .With(
        new Absolute({
          variant: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100vh",
          z_index: 999,
        })
      )
      .With(new Transition("slow", "opacity"))
      .With("opacity", "0")
      .With("pointer-events", "none")
  )
  .With(
    Rule.Init(".container.open")
      .With("opacity", "1")
      .With("pointer-events", "auto")
  )
  .With(
    Rule.Init(".close-button")
      .With(
        new Absolute({
          top: CT.padding.block.Top,
          right: CT.padding.block.Right,
        })
      )
      .With("cursor", "pointer")
      .With("opacity", "1")
      .With("text-decoration", "none")
      .With(new Transition("fast", "opacity"))
  )
  .With(Rule.Init(".close-button:hover").With("opacity", "0.5"))
  .With(
    Rule.Init(".backdrop")
      .With(
        new Absolute({
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        })
      )
      .With(CT.colours.contrast)
      .With("opacity", "0.7")
  );

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
        <section class={C("container", ["open", this.state.open])}>
          <div class="backdrop" />
          <div class="modal">
            <slot />
            <a class="close-button" href="#">
              <p-icon name="close" size="2rem" colour="contrast" />
            </a>
          </div>
        </section>
      );
    },
    css() {
      return SharedStyles.With(
        Rule.Init(".container").With(new Flex("center", "center"))
      )
        .With(
          Rule.Init(".modal")
            .With(
              new Absolute({
                variant: "relative",
                width: "100%",
                height: "100%",
              })
            )
            .With("max-width", this.props.large ? "60rem" : "40rem")
            .With("max-height", this.props.large ? "40rem" : "30rem")
            .With("overflow", "auto")
            .With(CT.padding.block)
            .With(CT.padding.block.AsMargin())
            .With(CT.colours.body)
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With(new Transition("slow", "transform"))
            .With("transform", "translate(0, -5rem)")
        )
        .With(Rule.Init(".open .modal").With("transform", "translate(0, 0)"));
    },
  }
);

Define(
  "p-offcanvas",
  {
    hash: IsString,
    large: Optional(IsLiteral(true)),
    colour: Optional(IsOneOf(...ColourNames)),
  },
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
        <section class={C("container", ["open", this.state.open])}>
          <div class="backdrop" />
          <div class="offcanvas">
            <div class="content">
              <slot />
            </div>
            <a class="close-button" href="#">
              <p-icon name="close" size="2rem" colour="contrast" />
            </a>
          </div>
        </section>
      );
    },
    css() {
      const colour = this.props.colour
        ? GetColour(this.props.colour)
        : CT.colours.body;
      return SharedStyles.With(
        Rule.Init(".container").With(new Flex("center", "flex-start"))
      )
        .With(
          Rule.Init(".offcanvas")
            .With(
              new Absolute({
                variant: "relative",
                width: "0",
                height: "100%",
              })
            )
            .With("max-width", this.props.large ? "60rem" : "40rem")
            .With("overflow", "auto")
            .With(CT.padding.block)
            .With("margin", "0")
            .With(colour)
            .With(CT.border.standard.WithDirection("right"))
            .With(CT.box_shadow.large)
            .With(new Transition("slow", "width"))
        )
        .With(Rule.Init(".open .offcanvas").With("width", "100%"))
        .With(
          Rule.Init(".content").With(
            "width",
            this.props.large ? "60rem" : "40rem"
          )
        );
    },
  }
);
