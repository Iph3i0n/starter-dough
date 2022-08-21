import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import Object from "Src/utils/Object";
import C from "Src/utils/Class";
import { ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Keyframes, Rule } from "Src/CSS";
import Absolute, { Cover } from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Grid from "Src/styles/Grid";
import Transition from "Src/styles/Transition";
import Animation from "Src/styles/Animation";
import { IsString, Optional } from "@paulpopat/safe-type";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import { UseChildElements } from "Src/utils/Hooks";

function Circularise(value: number, max: number) {
  if (value >= max) return value - max;
  if (value < 0) return max + value;
  return value;
}

const Props = { colour: Optional(IsOneOf(...ColourNames)), height: IsString };

export default class Button extends PreactComponent<
  typeof Props,
  { current: number }
> {
  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  public constructor() {
    super();
    this.SetChild({ img: IsString }, function (props, parent) {
      const is_current = this.IndexOfParent === parent.Current;
      return WithStyles(
        <div>
          <img src={props.img} alt="" />
          <slot />
        </div>,
        Css.Init()
          .With(
            Keyframes.Init("entry")
              .With(Rule.Init("from").With("left", "-100%"))
              .With(Rule.Init("to").With("left", "0"))
          )
          .With(
            Keyframes.Init("exit")
              .With(Rule.Init("from").With("left", "0"))
              .With(Rule.Init("to").With("left", "100%"))
          )
          .With(
            Rule.Init("div")
              .With(new Flex("center", "center"))
              .With(
                new Absolute({
                  top: "0",
                  left: is_current ? "0" : "100%",
                  width: "100%",
                  height: "100%",
                })
              )
              .With(new Animation(is_current ? "entry" : "exit", "slow"))
          )
          .With(
            Rule.Init("img")
              .With(Cover)
              .With("object-fit", "cover")
              .With("z-index", "-1")
          )
      );
    });
  }

  public set Current(value: number) {
    this.State = { ...this.State, current: value };
  }

  public get Current() {
    return this.State.current;
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const [ref, children] = UseChildElements();
    const total = children.length;

    const modify_index = (modifier: number) => () => {
      this.State = {
        ...this.State,
        current: Circularise(this.State.current + modifier, total),
      };
    };

    const set_current = (current: number) =>
      (this.State = { ...this.State, current: current });

    return WithStyles(
      <>
        <slot ref={ref} />
        <div class="controls-overlay">
          <div class="arrow-button" onClick={modify_index(-1)}>
            <p-icon
              name="arrow-left-s"
              colour={props.colour ?? "body"}
              size="4rem"
            />
          </div>
          <div class="toggles">
            {Object.Range(total).map((_, i) => (
              <div
                class={C("item-toggle", ["active", this.State.current === i])}
                onClick={() => set_current(i)}
              />
            ))}
          </div>
          <div class="arrow-button" onClick={modify_index(1)}>
            <p-icon
              name="arrow-right-s"
              colour={props.colour ?? "body"}
              size="4rem"
            />
          </div>
        </div>
      </>,
      Css.Init()
        .With(
          Rule.Init(":host")
            .With("overflow", "hidden")
            .With("position", "relative")
            .With("display", "block")
            .With("height", props.height)
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With(GetColour(props.colour ?? "body"))
        )
        .With(
          Rule.Init(".controls-overlay")
            .With(Cover)
            .With(new Flex("center", "space-between"))
        )
        .With(
          Rule.Init(".toggles")
            .With("align-self", "flex-end")
            .With(new Grid(total, CT.padding.block.Y))
            .With(CT.padding.block.AsMargin().BottomOnly())
            .With("width", "50%")
        )
        .With(
          Rule.Init(".item-toggle")
            .With("height", "0.2rem")
            .With(GetColour(props.colour ?? "body"))
            .With("opacity", "0.5")
            .With("cursor", "pointer")
            .With(new Transition("fast", "height", "opacity"))
        )
        .With(Rule.Init(".toggles:hover .item-toggle").With("height", "0.3rem"))
        .With(Rule.Init(".item-toggle.active").With("opacity", "1"))
        .With(Rule.Init(".item-toggle.active").With("opacity", "1"))
        .With(
          Rule.Init(".arrow-button")
            .With("cursor", "pointer")
            .With("opacity", "1")
            .With("border", "none")
            .With(new Transition("fast", "opacity"))
        )
        .With(Rule.Init(".arrow-button:hover").With("opacity", "0.5"))
    );
  }

  public static get IncludedTags(): string[] {
    return ["p-icon"];
  }
}
