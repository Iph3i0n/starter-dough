import Register from "Src/Register";
import { h } from "preact";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import Css, { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { ColourName, ColourNames, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import { On } from "Src/utils/Html";
import { useEffect, useState } from "preact/hooks";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      "p-modal": CustomElement<{
        watch: string;
        large?: true;
        colour?: ColourName;
      }>;
      "p-offcanvas": CustomElement<{
        watch: string;
        large?: true;
        colour?: ColourName;
      }>;
    }
  }
}

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

Register(
  "p-modal",
  {
    watch: IsString,
    large: Optional(IsLiteral(true)),
    colour: Optional(IsOneOf(...ColourNames)),
  },
  (props) => {
    const [open, set_open] = useState(false);

    useEffect(() => On(props.watch, "click", () => set_open(true)), []);

    return WithStyles(
      <section class={C("container", ["open", open])}>
        <div class="backdrop" onClick={() => set_open(false)} />
        <div class="modal">
          {props.children}
          <div class="close-button" onClick={() => set_open(false)}>
            <p-icon name="close" size="2rem" colour="body" text />
          </div>
        </div>
      </section>,
      SharedStyles.With(
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
            .With("max-width", props.large ? "60rem" : "40rem")
            .With("max-height", props.large ? "40rem" : "30rem")
            .With("overflow", "auto")
            .With(CT.padding.block)
            .With(CT.padding.block.AsMargin())
            .With(GetColour(props.colour ?? "surface"))
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With(new Transition("slow", "transform"))
            .With("transform", "translate(0, -5rem)")
        )
        .With(Rule.Init(".open .modal").With("transform", "translate(0, 0)"))
    );
  }
);

Register(
  "p-offcanvas",
  {
    watch: IsString,
    large: Optional(IsLiteral(true)),
    colour: Optional(IsOneOf(...ColourNames)),
  },
  (props) => {
    const [open, set_open] = useState(false);

    useEffect(() => On(props.watch, "click", () => set_open(true)), []);

    return WithStyles(
      <section class={C("container", ["open", open])}>
        <div class="backdrop" onClick={() => set_open(false)} />
        <div class="offcanvas">
          <div class="content">{props.children}</div>
          <div class="close-button" onClick={() => set_open(false)}>
            <p-icon name="close" size="2rem" colour="body" text />
          </div>
        </div>
      </section>,
      SharedStyles.With(
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
            .With("max-width", props.large ? "60rem" : "40rem")
            .With("overflow", "auto")
            .With(CT.padding.block)
            .With("margin", "0")
            .With(GetColour(props.colour ?? "surface"))
            .With(CT.border.standard.WithDirection("right").WithRadius("0"))
            .With(CT.box_shadow.large)
            .With(new Transition("slow", "width"))
            .With("box-sizing", "border-box")
        )
        .With(Rule.Init(".open .offcanvas").With("width", "100%"))
        .With(
          Rule.Init(".content").With("width", props.large ? "60rem" : "40rem")
        )
    );
  }
);
