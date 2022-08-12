import PreactComponent, { FromProps } from "Src/BuildComponent";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import { useEffect, useRef, useState } from "preact/hooks";
import Padding from "Src/styles/Padding";

const Props = {
  img: Optional(IsString),
  "img-alt": Optional(IsString),
  colour: Optional(IsOneOf(...ColourNames)),
  flush: Optional(IsLiteral(true)),
  fill: Optional(IsLiteral(true)),
};

export default class Card extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const [has_title, set_has_title] = useState(false);
    const ref = useRef<HTMLSlotElement>(null);
    useEffect(() => {
      set_has_title((ref.current?.assignedNodes().length ?? 0) > 0);
    }, [ref.current]);

    return WithStyles(
      <>
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
          <slot />
        </div>
      </>,
      Css.Init()
        .With(
          Rule.Init(":host")
            .With("display", "block")
            .With(GetColour(props.colour ?? "surface"))
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With("overflow", "hidden")
            .With("position", "relative")
            .With("height", props.fill ? "100%" : "auto")
        )
        .With(
          Rule.Init(".card-img-top")
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
          Rule.Init(".card-body")
            .With(props.flush ? new Padding("padding", "0") : CT.padding.block)
            .With("height", "100%")
            .With("box-sizing", "border-box")
        )
        .With(
          Rule.Init("p-text")
            .With("display", has_title ? "block" : "none")
            .With(CT.padding.block.AsMargin().BottomOnly())
        )
    );
  }
}
