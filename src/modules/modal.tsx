import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { ColourNames, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import { On } from "Src/utils/Html";
import { useEffect, useState } from "preact/hooks";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import SharedStyles from "Src/rules/Modal";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
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