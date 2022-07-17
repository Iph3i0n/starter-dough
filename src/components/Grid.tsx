import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { Columns, Sizes, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import { IsLiteral, IsString, IsUnion, Optional } from "@paulpopat/safe-type";
import Object from "Src/utils/Object";

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
      return {
        section: {
          margin: "auto",
          maxWidth: "100%",
          padding: this.props.flush ? "0" : CT.padding.block,
        },
        "section.full-width": {
          maxWidth: "100%",
        },
        ...Object.MapArray(Sizes, (size) => ({
          [`@media screen and (min-width: ${CT.screen[size].breakpoint})`]: {
            "section:not(.full-width)": {
              maxWidth: CT.screen[size].width,
            },
          },
        })),
      };
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
      return {
        ":host": {
          display: "grid",
          gap: CT.padding.block,
          gridTemplateColumns: `repeat(${Columns}, minmax(0, 1fr))`,
          margin: this.props.flush ? "0" : `${CT.padding.block} 0`,
        },
      };
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
      return {
        ...Object.MapArray(Sizes, (size) =>
          this.props[size]
            ? {
                [`@media screen and (min-width: ${CT.screen[size].breakpoint})`]:
                  {
                    ":host": {
                      gridColumn: "auto / span " + this.props[size],
                    },
                  },
              }
            : {}
        ),
        ":host": {
          display: "flex",
          alignItems: this.props.center ? "center" : "flex-start",
          justifyContent:
            this.props.align === "center"
              ? "center"
              : this.props.align === "right"
              ? "flex-end"
              : "flex-start",
          flexWrap: "wrap",
        },
      };
    },
  }
);
