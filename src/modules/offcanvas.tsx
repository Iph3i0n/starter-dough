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
