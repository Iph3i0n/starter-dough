import Register from "Src/Register";
import { h } from "preact";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { ColourName, ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsString, Optional } from "@paulpopat/safe-type";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      "p-card": CustomElement<{
        img?: string;
        "img-alt"?: string;
        colour?: ColourName;
      }>;
    }
  }
}

Register(
  "p-card",
  {
    img: Optional(IsString),
    "img-alt": Optional(IsString),
    colour: Optional(IsOneOf(...ColourNames)),
  },
  (props) =>
    WithStyles(
      <div class="card">
        {props.img && (
          <img
            src={props.img}
            alt={props["img-alt"] ?? ""}
            class="card-img-top"
          />
        )}
        <div class="card-body">
          <h5 class="card-title">
            <slot name="title" />
          </h5>
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
        .With(Rule.Init(".card .card-body").With(CT.padding.block))
        .With(
          Rule.Init(".card .card-title")
            .With(CT.text.body_large)
            .With(CT.padding.block.AsMargin().BottomOnly())
        )
    )
);
