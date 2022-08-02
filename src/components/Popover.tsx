import Register from "Src/Register";
import { Fragment } from "preact";
import WithStyles from "Src/utils/Styles";
import Css, { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Transition from "Src/styles/Transition";
import { CT } from "Src/Theme";
import { On } from "Src/utils/Html";
import { IsOneOf } from "Src/utils/Type";
import { useEffect, useState } from "preact/hooks";
import { IsString, Optional } from "@paulpopat/safe-type";

Register(
  "p-popover",
  {
    target: IsString,
    trigger: IsString,
    position: Optional(IsOneOf("top", "bottom", "left", "right")),
    on: Optional(IsOneOf("click", "hover")),
  },
  (props) => {
    const [open, set_open] = useState(false);
    const [dimensions, set_dimensions] = useState({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      current_height: 0,
      current_width: 0,
    });

    useEffect(() => {
      const target = document.querySelector(props.target);
      if (!target) throw new Error("No target for Popover");

      const bounds = target.getBoundingClientRect();
      const current_bounds = props.ref?.current?.getBoundingClientRect();
      set_dimensions({
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
        current_width: current_bounds?.width ?? 0,
        current_height: current_bounds?.height ?? 0,
      });

      return (() => {
        switch (props.on) {
          case "hover":
            const p1 = On(props.trigger, "mouseenter", () => set_open(true));
            const p2 = On(props.trigger, "mouseleave", () => set_open(false));
            return () => {
              p1();
              p2();
            };
          case "click":
          default:
            return On(props.trigger, "click", () => set_open((o) => !o));
        }
      })();
    }, [props.trigger, props.target, props.ref?.current]);
    const [translate_start, translate_end, position] = (() => {
      switch (props.position) {
        case "left":
          return [
            "translate(-5rem, -50%)",
            `translate(-${CT.padding.block.Left}, -50%)`,
            {
              left: dimensions.left - dimensions.current_width + "px",
              top: dimensions.top + dimensions.height / 2 + "px",
            },
          ] as const;
        case "right":
          return [
            "translate(5rem, -50%)",
            `translate(${CT.padding.block.Right}, -50%)`,
            {
              left: dimensions.left + dimensions.width + "px",
              top: dimensions.top + dimensions.height / 2 + "px",
            },
          ] as const;
        case "bottom":
          return [
            "translate(-50%, 5rem)",
            `translate(-50%, ${CT.padding.block.Bottom})`,
            {
              top: dimensions.top + dimensions.height + "px",
              left: dimensions.left + dimensions.width / 2 + "px",
            },
          ] as const;
        case "top":
        default:
          return [
            "translate(-50%, -5rem)",
            `translate(-50%, -${CT.padding.block.Top})`,
            {
              top: dimensions.top - dimensions.current_height + "px",
              left: dimensions.left + dimensions.width / 2 + "px",
            },
          ] as const;
      }
    })();

    return WithStyles(
      <>{props.children}</>,
      Css.Init().With(
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
          .With("opacity", open ? "1" : "0")
          .With("transform", open ? translate_end : translate_start)
          .With("pointer-events", open ? "auto" : "none")
          .With(new Transition("fast", "opacity", "transform"))
      )
    );
  }
);
