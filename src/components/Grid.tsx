import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { Sizes, CT } from "Src/Theme";
import C from "Src/utils/Class";
import { IsLiteral, IsString, IsUnion, Optional } from "@paulpopat/safe-type";
import Object from "Src/utils/Object";
import Css, { Media, Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import Grid from "Src/styles/Grid";
import Flex from "Src/styles/Flex";

Define(
  "p-container",
  { "full-width": Optional(IsLiteral(true)), flush: Optional(IsLiteral(true)) },
  {},
  {
    render() {
      return (
        <section class={C(["full-width", "full-width" in this.props])}>
          <slot />
        </section>
      );
    },
    css() {
      let result: Css = Css.Init()
        .With(
          Rule.Init("section")
            .With("margin", "auto")
            .With("max-width", "100%")
            .With(
              this.props.flush ? new Padding("padding", "0") : CT.padding.block
            )
        )
        .With(Rule.Init("section.full-width").With("max-width", "100%"));

      for (const size of Sizes) {
        result = result.With(
          Media.Init(`min-width: ${CT.screen[size].breakpoint}`).With(
            Rule.Init("section:not(.full-width)").With(
              "max-width",
              CT.screen[size].width
            )
          )
        );
      }

      return result;
    },
  }
);

Define(
  "p-row",
  { flush: Optional(IsLiteral(true)) },
  {},
  {
    render() {
      return <slot />;
    },
    css() {
      return Css.Init().With(
        Rule.Init(":host")
          .With(new Grid(12, CT.padding.block.X))
          .With(
            this.props.flush
              ? new Padding("margin", "0")
              : CT.padding.block.AsMargin().YOnly()
          )
      );
    },
  }
);

Define(
  "p-col",
  {
    ...Object.MapArrayAsKeys(Sizes, (k) => Optional(IsString)),
    center: Optional(IsLiteral(true)),
    align: Optional(
      IsUnion(IsLiteral("left"), IsLiteral("center"), IsLiteral("right"))
    ),
  },
  {},
  {
    render() {
      return <slot />;
    },
    css() {
      let result = Css.Init();

      for (const size of Sizes) {
        if (this.props[size])
          result = result.With(
            Media.Init(`min-width: ${CT.screen[size].breakpoint}`).With(
              Rule.Init(":host").With(
                "grid-column",
                "auto / span " + this.props[size]
              )
            )
          );
      }

      if (this.props.center || this.props.align)
        result = result.With(
          Rule.Init(":host").With(
            new Flex(
              this.props.center ? "center" : "flex-start",
              this.props.align === "center"
                ? "center"
                : this.props.align === "right"
                ? "flex-end"
                : this.props.align === "left"
                ? "flex-start"
                : "stretch",
              { wrap: true }
            )
          )
        );

      return result;
    },
  }
);
