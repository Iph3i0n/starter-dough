import Jsx from "Src/Jsx";
import Define from "Src/Component";
import Object from "Src/utils/Object";
import C from "Src/utils/Class";
import { ColourNames, CT, GetColour } from "Src/Theme";
import CreateContext from "Src/utils/Context";
import { IsString } from "@paulpopat/safe-type";
import { GetIndexOfParent } from "Src/utils/Html";
import { IsOneOf } from "Src/utils/Type";
import Css, { Keyframes, Rule } from "Src/CSS";
import Absolute, { Cover } from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Grid from "Src/styles/Grid";
import Transition from "Src/styles/Transition";
import Animation from "Src/styles/Animation";

const Context = CreateContext({ current: 0, total: 0 });

function Circularise(value: number, max: number) {
  if (value >= max) return value - max;
  if (value < 0) return max + value;
  return value;
}

Define(
  "p-carousel",
  { colour: IsOneOf(...ColourNames), height: IsString },
  { current: 0, total: 0 },
  {
    render() {
      this.Provide(Context, this.State);
      this.On("children", () => {
        if (this.ChildElements.length !== this.State.total)
          this.State = { ...this.State, total: this.ChildElements.length };
      });
      const modify_index = (modifier: number) =>
        (this.State = {
          ...this.State,
          current: Circularise(this.State.current + modifier, this.State.total),
        });

      return (
        <>
          <slot />
          <div class="controls-overlay">
            <div class="arrow-button" on_click={() => modify_index(-1)}>
              <p-icon
                name="arrow-left-s"
                colour={this.Props.colour}
                size="4rem"
              />
            </div>
            <div class="toggles">
              {Object.Range(this.State.total).map((_, i) => (
                <div
                  class={C("item-toggle", ["active", this.State.current === i])}
                  on_click={() => (this.State = { ...this.State, current: i })}
                />
              ))}
            </div>
            <div class="arrow-button" on_click={() => modify_index(1)}>
              <p-icon
                name="arrow-right-s"
                colour={this.Props.colour}
                size="4rem"
              />
            </div>
          </div>
        </>
      );
    },
    css() {
      return Css.Init()
        .With(
          Rule.Init(":host")
            .With("overflow", "hidden")
            .With("position", "relative")
            .With("display", "block")
            .With("height", this.Props.height)
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With(GetColour(this.Props.colour))
        )
        .With(
          Rule.Init(".controls-overlay")
            .With(Cover)
            .With(new Flex("center", "space-between"))
        )
        .With(
          Rule.Init(".toggles")
            .With("align-self", "flex-end")
            .With(new Grid(this.State.total, CT.padding.block.Y))
            .With(CT.padding.block.AsMargin().BottomOnly())
            .With("width", "50%")
        )
        .With(
          Rule.Init(".item-toggle")
            .With("height", "0.2rem")
            .With(GetColour(this.Props.colour))
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
        .With(Rule.Init(".arrow-button:hover").With("opacity", "0.5"));
    },
  }
);

Define(
  "p-slide",
  { img: IsString },
  {},
  {
    render() {
      return (
        <div>
          <img src={this.Props.img} alt="" />
          <slot />
        </div>
      );
    },
    css() {
      const { current } = this.Use(Context);
      const index = GetIndexOfParent(this);
      const is_current = index === current;
      return Css.Init()
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
        );
    },
  }
);
