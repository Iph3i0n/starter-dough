import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { Columns, Sizes, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Object from "Src/utils/Object";

Define(
  "p-container",
  { "full-width": Optional(IsLiteral(true)) },
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
          padding: CT.padding.block,
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
  {},
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
          margin: `${CT.padding.block} 0`,
        },
      };
    },
  }
);

Define(
  "p-col",
  Object.MapArrayAsKeys(Sizes, (k) => Optional(IsString)),
  {},
  {
    render() {
      return <slot />;
    },
    css() {
      return Object.MapArray(Object.Keys(this.props), (size) => ({
        [`@media screen and (min-width: ${CT.screen[size].breakpoint})`]: {
          ":host": {
            gridColumn: "auto / span " + this.props[size],
          },
        },
      }));
    },
  }
);
