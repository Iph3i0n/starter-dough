import Jsx from "Src/Jsx";
import Define from "Src/Component";
import Object from "Src/utils/Object";
import C from "Src/utils/Class";
import { ColourNames, CT, GetColour } from "Src/Theme";
import CreateContext from "Src/utils/Context";
import { IsString } from "@paulpopat/safe-type";
import { GetIndexOfParent } from "Src/utils/Html";
import { IsOneOf } from "Src/utils/Type";

const Context = CreateContext({ current: 0, total: 0 });

function Circularise(value: number, max: number) {
  if (value >= max) return value - max;
  if (value < 0) return max + value;
  return value;
}

Define(
  "p-carousel",
  { colour: IsOneOf(...ColourNames), height: IsString },
  { current: 0, total: 0 },
  {
    render() {
      this.provide_context(Context, this.state);
      this.listen("children", function () {
        if (this.child_elements.length !== this.state.total)
          this.set_state({ ...this.state, total: this.child_elements.length });
      });
      const modify_index = (modifier: number) =>
        this.set_state({
          ...this.state,
          current: Circularise(this.state.current + modifier, this.state.total),
        });

      return (
        <>
          <slot />
          <div class="controls-overlay">
            <div class="arrow-button" on_click={() => modify_index(-1)}>
              <p-icon
                name="arrow-left-s"
                colour={this.props.colour}
                size="4rem"
              />
            </div>
            <div class="toggles">
              {Object.Range(this.state.total).map((_, i) => (
                <div
                  class={C("item-toggle", ["active", this.state.current === i])}
                  on_click={() => this.set_state({ ...this.state, current: i })}
                />
              ))}
            </div>
            <div class="arrow-button" on_click={() => modify_index(1)}>
              <p-icon
                name="arrow-right-s"
                colour={this.props.colour}
                size="4rem"
              />
            </div>
          </div>
        </>
      );
    },
    css() {
      return {
        ":host": {
          overflow: "hidden",
          position: "relative",
          display: "block",
          height: this.props.height,
          borderRadius: CT.border.radius,
          border: CT.border.standard_borders,
          boxShadow: CT.border.standard_box_shadow,
          color: GetColour(this.props.colour),
        },
        ".controls-overlay": {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        ".toggles": {
          alignSelf: "flex-end",
          display: "grid",
          gridTemplateColumns: `repeat(${this.state.total}, minmax(0, 1fr))`,
          gap: CT.padding.text_sm,
          marginBottom: CT.padding.block,
          width: "50%",
        },
        ".item-toggle": {
          height: "0.2rem",
          background: GetColour(this.props.colour),
          opacity: "0.5",
          transition: `height ${CT.animation.time_fast}, opacity ${CT.animation.time_fast}`,
          cursor: "pointer",
        },
        ".toggles:hover .item-toggle": {
          height: "0.3rem",
        },
        ".item-toggle.active": {
          opacity: "1",
        },
        ".arrow-button": {
          cursor: "pointer",
          opacity: "1",
          transition: `opacity ${CT.animation.time_fast}`,
          border: "none",
        },
        ".arrow-button:hover": {
          opacity: "0.5",
        },
      };
    },
  }
);

Define(
  "p-slide",
  { img: IsString },
  {},
  {
    render() {
      return (
        <div>
          <img src={this.props.img} alt="" />
          <slot />
        </div>
      );
    },
    css() {
      const { current, total } = this.use_context(Context);
      const index = GetIndexOfParent(this.ele);
      const is_current = index === current;
      const is_next = index === Circularise(current - 1, total);
      return {
        div: {
          display: "flex",
          position: "absolute",
          top: "0",
          left: is_current ? "0" : is_next ? "-100%" : "100%",
          transition: `left ${CT.animation.time_fast}`,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        img: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "-1",
        },
      };
    },
  }
);
