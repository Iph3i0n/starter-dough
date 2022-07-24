import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString } from "@paulpopat/safe-type";
import CreateContext from "Src/utils/Context";
import { GetIndexOfParent } from "Src/utils/Html";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import Flex from "Src/styles/Flex";

const AccordionContext = CreateContext({
  click: (index: number) => {},
  current: -1,
});

Define(
  "p-accordion",
  {},
  { open: -1 },
  {
    render() {
      this.Provide(AccordionContext, {
        click: (index) => (this.State = { open: index }),
        current: this.State.open,
      });
      return <slot />;
    },
  }
);

Define(
  "p-accordion-item",
  { title: IsString },
  { height: 0 },
  {
    render() {
      const { click, current } = this.Use(AccordionContext);
      const open = current === GetIndexOfParent(this);
      this.On("render", () => {
        const height = this.Root.querySelector(".content")?.clientHeight ?? -1;
        if (height !== this.State.height) this.State = { height };
      });

      return (
        <>
          <div
            class="item-heading"
            on_click={() => click(open ? -1 : GetIndexOfParent(this))}
          >
            <p-heading level="6" no-margin>
              {this.Props.title}
            </p-heading>
            <p-icon name="arrow-down" size={CT.text.h6.Size} colour="dark" />
          </div>
          <div class="container">
            <div class="content">
              <slot />
            </div>
          </div>
        </>
      );
    },
    css() {
      const { current } = this.Use(AccordionContext);
      const open = current === GetIndexOfParent(this);
      return Css.Init()
        .With(
          Rule.Init(".container")
            .With("overflow", "hidden")
            .With("height", open ? this.State.height + "px" : "0")
            .With(new Transition("fast", "height"))
        )
        .With(Rule.Init(".content").With(CT.padding.block))
        .With(
          Rule.Init(".item-heading")
            .With("cursor", "pointer")
            .With("position", "relative")
            .With(CT.padding.block)
            .With(open ? CT.colours.surface : CT.colours.body)
            .With(CT.border.standard)
            .With(CT.padding.block.AsMargin().BottomOnly())
            .With(CT.box_shadow.large)
            .With(new Flex("center", "space-between"))
            .With(new Transition("fast", "color", "background-color"))
        )
        .With(Rule.Init(".item-heading:hover").With(CT.colours.surface))
        .With(
          Rule.Init("p-icon")
            .With("transform", open ? "rotate(180deg)" : "rotate(0deg)")
            .With(new Transition("fast", "transform"))
        );
    },
  }
);
