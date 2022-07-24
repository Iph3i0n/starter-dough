import { IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Css, { Rule } from "Src/CSS";
import Jsx from "Src/Jsx";
import Absolute from "Src/styles/Absolute";
import Transition from "Src/styles/Transition";
import { CT } from "Src/Theme";
import { On } from "Src/utils/Html";
import { IsOneOf } from "Src/utils/Type";

Define(
  "p-popover",
  {
    target: IsString,
    trigger: IsString,
    position: Optional(IsOneOf("top", "bottom", "left", "right")),
    on: Optional(IsOneOf("click", "hover")),
  },
  {
    open: false,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    current_height: 0,
    current_width: 0,
  },
  {
    render() {
      this.On("children", () => {
        const target = document.querySelector(this.Props.target);
        if (!target) throw new Error("No target for Popover");

        const bounds = target.getBoundingClientRect();
        const current_bounds = this.getBoundingClientRect();
        this.State = {
          ...this.State,
          top: bounds.top,
          left: bounds.left,
          width: bounds.width,
          height: bounds.height,
          current_width: current_bounds.width,
          current_height: current_bounds.height,
        };

        switch (this.Props.on) {
          case "hover":
            On(
              this.Props.trigger,
              "mouseenter",
              () => (this.State = { ...this.State, open: true })
            );
            On(
              this.Props.trigger,
              "mouseleave",
              () => (this.State = { ...this.State, open: false })
            );
            break;
          case "click":
          default:
            On(
              this.Props.trigger,
              "click",
              () => (this.State = { ...this.State, open: !this.State.open })
            );
        }
      });

      return <slot />;
    },
    css() {
      const [translate_start, translate_end, position] = (() => {
        switch (this.Props.position) {
          case "left":
            return [
              "translate(-5rem, -50%)",
              `translate(-${CT.padding.block.Left}, -50%)`,
              {
                left: this.State.left - this.State.current_width + "px",
                top: this.State.top + this.State.height / 2 + "px",
              },
            ] as const;
          case "right":
            return [
              "translate(5rem, -50%)",
              `translate(${CT.padding.block.Right}, -50%)`,
              {
                left: this.State.left + this.State.width + "px",
                top: this.State.top + this.State.height / 2 + "px",
              },
            ] as const;
          case "bottom":
            return [
              "translate(-50%, 5rem)",
              `translate(-50%, ${CT.padding.block.Bottom})`,
              {
                top: this.State.top + this.State.height + "px",
                left: this.State.left + this.State.width / 2 + "px",
              },
            ] as const;
          case "top":
          default:
            return [
              "translate(-50%, -5rem)",
              `translate(-50%, -${CT.padding.block.Top})`,
              {
                top: this.State.top - this.State.current_height + "px",
                left: this.State.left + this.State.width / 2 + "px",
              },
            ] as const;
        }
      })();
      return Css.Init().With(
        Rule.Init(":host")
          .With("display", "block")
          .With(
            new Absolute({
              variant: "fixed",
              ...position,
            })
          )
          .With(CT.colours.surface)
          .With(CT.border.standard)
          .With(CT.box_shadow.large)
          .With(CT.padding.small_block)
          .With("margin", "auto")
          .With("opacity", this.State.open ? "1" : "0")
          .With("transform", this.State.open ? translate_end : translate_start)
          .With("pointer-events", this.State.open ? "auto" : "none")
          .With(new Transition("fast", "opacity", "transform"))
      );
    },
  }
);
