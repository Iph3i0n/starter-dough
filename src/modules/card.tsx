import BuildComponent from "Src/BuildComponent";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import { useEffect, useRef, useState } from "preact/hooks";
import Padding from "Src/styles/Padding";

export default BuildComponent(
  {
    img: Optional(IsString),
    "img-alt": Optional(IsString),
    colour: Optional(IsOneOf(...ColourNames)),
    flush: Optional(IsLiteral(true)),
  },
  (props) => {
    const [has_title, set_has_title] = useState(false);
    const ref = useRef<HTMLSlotElement>(null);
    useEffect(() => {
      set_has_title((ref?.current?.assignedNodes().length ?? 0) > 0);
    }, [ref.current]);

    return WithStyles(
      <div class="card">
        {props.img && (
          <img
            src={props.img}
            alt={props["img-alt"] ?? ""}
            class="card-img-top"
          />
        )}
        <div class="card-body">
          <p-text variant="h5" no-margin>
            <slot name="title" ref={ref} />
          </p-text>
          {props.children}
        </div>
      </div>,
      Css.Init()
        .With(
          Rule.Init(".card")
            .With(GetColour(props.colour ?? "surface"))
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With("overflow", "hidden")
            .With("position", "relative")
        )
        .With(
          Rule.Init(".card .card-img-top")
            .With("display", "block")
            .With("max-width", "100%")
            .With("object-fit", "cover")
            .With(CT.colours.contrast)
            .With(CT.text.body.WithAlignment("center").WithoutPadding())
            .With(CT.border.standard.WithDirection("bottom"))
            .With("border-bottom-left-radius", "0")
            .With("border-bottom-right-radius", "0")
        )
        .With(
          Rule.Init(".card .card-body").With(
            props.flush ? new Padding("padding", "0") : CT.padding.block
          )
        )
        .With(
          Rule.Init("p-text")
            .With("display", has_title ? "block" : "none")
            .With(CT.padding.block.AsMargin().BottomOnly())
        )
    );
  }
);
