import Register from "Src/Register";
import WithStyles from "Src/utils/Styles";
import { CT } from "Src/Theme";
import Css, { Keyframes, Rule } from "Src/CSS";
import { IsOneOf } from "Src/utils/Type";
import Absolute from "Src/styles/Absolute";
import { IsString } from "@paulpopat/safe-type";
import Animation from "Src/styles/Animation";
import Transition from "Src/styles/Transition";
import Flex from "Src/styles/Flex";
import Padding from "Src/styles/Padding";
import WithChild from "./Child";

Register(
  "p-toast",
  { position: IsOneOf("top-left", "top-right", "bottom-left", "bottom-right") },
  WithChild(
    (props) =>
      WithStyles(
        <>{props.children}</>,
        Css.Init().With(
          Rule.Init(":host")
            .With("display", "block")
            .With(
              new Absolute({
                variant: "fixed",
                top: props.position.startsWith("top") ? "0" : undefined,
                bottom: props.position.startsWith("bottom") ? "0" : undefined,
                left: props.position.endsWith("left") ? "0" : undefined,
                right: props.position.endsWith("right") ? "0" : undefined,
              })
            )
            .With(CT.padding.block)
        )
      ),
    { icon: IsString },
    (props) =>
      WithStyles(
        <>
          <div class="title">
            <img src={props.icon} alt="" />

            <span class="title-content">
              <slot name="title" />
            </span>

            <div
              class="close-button"
              onClick={() => props.ref?.current?.remove()}
            >
              <p-icon name="close" size="2rem" colour="contrast" text />
            </div>
          </div>
          <div class="body">{props.children}</div>
        </>,
        Css.Init()
          .With(
            Keyframes.Init("enter")
              .With(Rule.Init("from").With("opacity", "0"))
              .With(Rule.Init("to").With("opacity", "1"))
          )
          .With(
            Rule.Init(":host")
              .With("display", "block")
              .With("position", "relative")
              .With(new Animation("enter", "fast"))
              .With(CT.colours.surface)
              .With(CT.border.standard)
              .With(CT.box_shadow.large)
              .With("overflow", "hidden")
              .With("width", "15rem")
          )
          .With(
            Rule.Init(".title")
              .With(CT.colours.primary)
              .With(CT.border.standard.WithRadius("0").WithDirection("bottom"))
              .With(new Flex("center", "flex-start"))
          )
          .With(Rule.Init(".title-content").With(CT.padding.small_block))
          .With(
            Rule.Init(".body")
              .With(CT.padding.small_block)
              .With(CT.border.standard.WithRadius("0").WithDirection("bottom"))
              .With(new Flex("center", "flex-start"))
              .With(CT.text.body.WithPadding(new Padding("margin", "0")))
          )
          .With(Rule.Init(".title-content").With("flex", "1"))
          .With(
            Rule.Init(".close-button")
              .With("cursor", "pointer")
              .With("opacity", "1")
              .With("text-decoration", "none")
              .With(new Transition("fast", "opacity"))
              .With("modifier", Rule.Init(":hover").With("opacity", "0.5"))
          )
          .With(
            Rule.Init("img")
              .With("display", "inline-block")
              .With("object-fit", "cover")
              .With("width", CT.text.body.Size)
              .With("height", CT.text.body.Size)
              .With(CT.border.standard)
              .With(CT.box_shadow.small)
              .With(CT.padding.small_block.AsMargin())
          )
      )
  )
);
