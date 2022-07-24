import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString } from "@paulpopat/safe-type";
import { IsHtmlElement } from "Src/utils/Type";
import { GetMousePosition } from "Src/utils/Mouse";
import { CT, GetColour } from "Src/Theme";
import Css, { Keyframes, Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Animation from "Src/styles/Animation";
import Transition from "Src/styles/Transition";

Define(
  "p-dropdown",
  { target: IsString },
  { open: false, position: [-1, -1] as readonly [number, number] },
  {
    render() {
      this.On("load", () =>
        document.addEventListener("click", (e) => {
          const target: Node | null = e.target as any;
          if (
            !target ||
            !IsHtmlElement(target) ||
            target.id !== this.Props.target
          )
            this.State = ({ ...this.State, open: false });
          else this.State = ({ open: true, position: GetMousePosition() });
        })
      );

      if (this.State.open)
        return (
          <div>
            <slot />
          </div>
        );
      return <></>;
    },
    css() {
      const [x, y] = this.State.position as [number, number];
      return Css.Init()
        .With(
          Keyframes.Init("fade-in")
            .With(Rule.Init("from").With("opacity", "0"))
            .With(Rule.Init("to").With("opacity", "1"))
        )
        .With(
          Rule.Init("div")
            .With(
              new Absolute({
                variant: "fixed",
                top: y.toString() + "px",
                left: x.toString() + "px",
              })
            )
            .With(CT.colours.surface)
            .With(CT.border.small)
            .With(CT.box_shadow.large)
            .With(new Animation("fade-in", "fast"))
            .With("margin", "hidden")
            .With("overflow", "hidden")
            .With("min-width", "10rem")
        );
    },
  }
);

Define(
  "p-dropdown-item",
  { "on-click": IsString },
  {},
  {
    render() {
      const on_click = (window as any)[this.Props["on-click"]] ?? (() => {});

      return (
        <button type="button" on_click={(e: any) => on_click(e)}>
          <slot />
        </button>
      );
    },
    css() {
      return Css.Init()
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
        .With(Rule.Init("button:hover").With(CT.colours.contrast));
    },
  }
);

Define(
  "p-dropdown-divider",
  {},
  {},
  {
    render() {
      return <hr />;
    },
    css() {
      return Css.Init().With(
        Rule.Init("hr")
          .With("display", "block")
          .With("border", "none")
          .With("box-shadow", "none")
          .With("margin", "0")
          .With("width", "100%")
          .With(CT.border.standard.WithDirection("bottom").WithRadius("0"))
      );
    },
  }
);
