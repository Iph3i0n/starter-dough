import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import EventManager from "Src/utils/EventManager";
import CreateContext from "Src/utils/Context";
import { GetIndexOfParent } from "Src/utils/Html";
import C from "Src/utils/Class";
import { CT } from "Src/Theme";

const AccordionContext = CreateContext({
  click: (index: number) => {},
  current: -1,
});

Define(
  "p-accordion",
  {},
  { open: -1 },
  {
    render() {
      this.provide_context(AccordionContext, {
        click: (index) => this.set_state({ open: index }),
        current: this.state.open,
      });
      return <slot />;
    },
  }
);

Define(
  "p-accordion-item",
  { title: IsString },
  { height: 0 },
  {
    render() {
      const { click, current } = this.use_context(AccordionContext);
      const open = current === GetIndexOfParent(this.ele);
      this.listen("render", function () {
        const height = this.root.querySelector(".content")?.clientHeight ?? -1;
        if (height !== this.state.height) this.set_state({ height });
      });

      return (
        <>
          <div
            class="item-heading"
            on_click={() => click(open ? -1 : GetIndexOfParent(this.ele))}
          >
            <p-heading level="6" no-margin>
              {this.props.title}
            </p-heading>
            <p-icon name="arrow-down" size={CT.text.size.h6} colour="dark" />
          </div>
          <div class="container">
            <div class="content">
              <slot />
            </div>
          </div>
        </>
      );
    },
    css() {
      const { current } = this.use_context(AccordionContext);
      const open = current === GetIndexOfParent(this.ele);
      return {
        ".container": {
          overflow: "hidden",
          height: open ? this.state.height + "px" : "0",
          transition: `height ${CT.animation.time_fast}`,
        },
        ".content": {
          padding: CT.padding.block,
        },
        ".item-heading": {
          padding: CT.padding.block,
          background: open
            ? CT.colours.bg_surface.Hex
            : CT.colours.bg_white.Hex,
          cursor: "pointer",
          borderRadius: CT.border.radius,
          marginBottom: CT.padding.block,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: CT.border.standard_borders,
          boxShadow: CT.border.standard_box_shadow,
          position: "relative",
        },
        ".item-heading:hover": {
          background: CT.colours.bg_surface.Hex,
        },
        "p-icon": {
          transition: `transform ${CT.animation.time_fast}`,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        },
      };
    },
  }
);
