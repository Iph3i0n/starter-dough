import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Css, { Rule } from "Src/CSS";
import Jsx from "Src/Jsx";
import Absolute from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { ColourNames, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import { On } from "Src/utils/Html";
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
  { watch: IsString, large: Optional(IsLiteral(true)) },
  { open: false },
  {
    render() {
      this.On("load", () =>
        On(this.Props.watch, "click", () => (this.State = { open: true }))
      );
      return (
        <section class={C("container", ["open", this.State.open])}>
          <div
            class="backdrop"
            on_click={() => (this.State = { open: false })}
          />
          <div class="modal">
            <slot />
            <div
              class="close-button"
              on_click={() => (this.State = { open: false })}
            >
              <p-icon name="close" size="2rem" colour="body" text />
            </div>
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
            .With("max-width", this.Props.large ? "60rem" : "40rem")
            .With("max-height", this.Props.large ? "40rem" : "30rem")
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
    watch: IsString,
    large: Optional(IsLiteral(true)),
    colour: Optional(IsOneOf(...ColourNames)),
  },
  { open: false },
  {
    render() {
      this.On("load", () => {
        On(this.Props.watch, "click", () => (this.State = { open: true }));
      });

      return (
        <section class={C("container", ["open", this.State.open])}>
          <div
            class="backdrop"
            on_click={() => (this.State = { open: false })}
          />
          <div class="offcanvas">
            <div class="content">
              <slot />
            </div>
            <div
              class="close-button"
              on_click={() => (this.State = { open: false })}
            >
              <p-icon name="close" size="2rem" colour="body" text />
            </div>
          </div>
        </section>
      );
    },
    css() {
      const colour = this.Props.colour
        ? GetColour(this.Props.colour)
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
            .With("max-width", this.Props.large ? "60rem" : "40rem")
            .With("overflow", "auto")
            .With(CT.padding.block)
            .With("margin", "0")
            .With(colour)
            .With(CT.border.standard.WithDirection("right").WithRadius("0"))
            .With(CT.box_shadow.large)
            .With(new Transition("slow", "width"))
            .With("box-sizing", "border-box")
        )
        .With(Rule.Init(".open .offcanvas").With("width", "100%"))
        .With(
          Rule.Init(".content").With(
            "width",
            this.Props.large ? "60rem" : "40rem"
          )
        );
    },
  }
);
