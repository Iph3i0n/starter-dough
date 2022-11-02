import WithStyles from "Src/utils/Styles";
import { IsHtmlElement, IsOneOf } from "Src/utils/Type";
import { GetMousePosition, Position } from "Src/utils/Mouse";
import { CT } from "Src/Theme";
import Css, { Keyframes, Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Animation from "Src/styles/Animation";
import Transition from "Src/styles/Transition";
import { useEffect, useState } from "preact/hooks";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import PreactComponent, { FromProps } from "Src/BuildComponent";

const Props = {
  target: IsString,
  anchor: Optional(IsOneOf("left", "right")),
};

export default class Dropdown extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  public constructor() {
    super();
    this.SetChild(
      {
        divider: Optional(IsLiteral(true)),
        href: Optional(IsString),
        target: Optional(IsString),
      },
      function (props) {
        return WithStyles(
          props.divider ? (
            <hr />
          ) : props.href ? (
            <a href={props.href} target={props.target ?? undefined}>
              <slot />
            </a>
          ) : (
            <div>
              <slot />
            </div>
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
                  Rule.Init("div, a")
                    .With(CT.padding.small_block)
                    .With("cursor", "pointer")
                    .With(CT.colours.surface)
                    .With(CT.text.body)
                    .With(new Transition("fast", "background-color", "color"))
                    .With("display", "block")
                    .With("border", "none")
                    .With("box-shadow", "none")
                    .With("width", "100%")
                    .With("text-align", "left")
                    .With("text-decoration", "none")
                )
                .With(Rule.Init("div:hover").With(CT.colours.body))
        );
      }
    );
  }

  protected IsProps = Props;

  private get Position() {
    const target = document.getElementById(this.Props.target);
    if (!target)
      return new Absolute({
        variant: "fixed",
        top: "-1px",
        left: "-1px",
      });

    const at = this.Props.anchor;

    switch (at ?? "left") {
      case "left":
        return new Absolute({
          variant: "fixed",
          top: `${target.offsetTop + target.offsetHeight + 3}px`,
          left: `${target.offsetLeft}px`,
        });
      case "right":
        return new Absolute({
          variant: "fixed",
          top: `${target.offsetTop + target.offsetHeight + 3}px`,
          left: `${
            target.offsetLeft + target.offsetWidth - this.offsetWidth
          }px`,
        });
    }
  }

  protected Render(props: FromProps<typeof Props>) {
    const [open, set_open] = useState(false);
    useEffect(() => {
      document.addEventListener("click", (e) => {
        const target: Node | null = e.target as any;
        if (!target || !IsHtmlElement(target) || target.id !== props.target)
          set_open(false);
        else {
          set_open(true);
        }
      });
    }, []);

    return WithStyles(
      open ? <slot /> : <></>,
      Css.Init()
        .With(
          Keyframes.Init("fade-in")
            .With(Rule.Init("from").With("opacity", "0"))
            .With(Rule.Init("to").With("opacity", "1"))
        )
        .With(
          Rule.Init(":host")
            .With(this.Position)
            .With(CT.colours.surface)
            .With(CT.border.small)
            .With(CT.box_shadow.large)
            .With(new Animation("fade-in", "fast"))
            .With("margin", "0")
            .With("overflow", "hidden")
            .With("min-width", "10rem")
        )
    );
  }
}
