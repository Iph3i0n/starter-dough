import WithStyles from "Src/utils/Styles";
import { IsHtmlElement } from "Src/utils/Type";
import { GetMousePosition, Position } from "Src/utils/Mouse";
import { CT } from "Src/Theme";
import Css, { Keyframes, Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Animation from "Src/styles/Animation";
import Transition from "Src/styles/Transition";
import { useEffect, useState } from "preact/hooks";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import WithChild from "Src/contexts/WithChild";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  { target: IsString },
  WithChild(
    (props) => {
      const [open, set_open] = useState(false);
      const [position, set_position] = useState([-1, -1] as Position);
      useEffect(() => {
        document.addEventListener("click", (e) => {
          const target: Node | null = e.target as any;
          if (!target || !IsHtmlElement(target) || target.id !== props.target)
            set_open(false);
          else {
            set_position(GetMousePosition());
            set_open(true);
          }
        });
      }, []);

      return WithStyles(
        open ? <>{props.children}</> : <></>,
        Css.Init()
          .With(
            Keyframes.Init("fade-in")
              .With(Rule.Init("from").With("opacity", "0"))
              .With(Rule.Init("to").With("opacity", "1"))
          )
          .With(
            Rule.Init(":host")
              .With(
                new Absolute({
                  variant: "fixed",
                  top: position[1].toString() + "px",
                  left: position[0].toString() + "px",
                })
              )
              .With(CT.colours.surface)
              .With(CT.border.small)
              .With(CT.box_shadow.large)
              .With(new Animation("fade-in", "fast"))
              .With("margin", "hidden")
              .With("overflow", "hidden")
              .With("min-width", "10rem")
          )
      );
    },
    { divider: Optional(IsLiteral(true)) },
    (props) =>
      WithStyles(
        props.divider ? (
          <hr />
        ) : (
          <button type="button">{props.children}</button>
        ),
        props.divider
          ? Css.Init().With(
              Rule.Init("hr")
                .With("display", "block")
                .With("border", "none")
                .With("box-shadow", "none")
                .With("margin", "0")
                .With("width", "100%")
                .With(
                  CT.border.standard.WithDirection("bottom").WithRadius("0")
                )
            )
          : Css.Init()
              .With(
                Rule.Init("button")
                  .With(CT.padding.block)
                  .With("cursor", "pointer")
                  .With(CT.colours.surface)
                  .With(CT.text.body)
                  .With(new Transition("fast", "background-color", "color"))
                  .With("display", "block")
                  .With("border", "none")
                  .With("box-shadow", "none")
                  .With("width", "100%")
                  .With("text-align", "left")
              )
              .With(Rule.Init("button:hover").With(CT.colours.contrast))
      )
  )
);
