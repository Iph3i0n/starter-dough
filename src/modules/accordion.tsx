import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import Flex from "Src/styles/Flex";
import { v4 as Guid } from "uuid";
import WithStyles from "Src/utils/Styles";
import { IsString } from "@paulpopat/safe-type";
import PreactComponent from "Src/BuildComponent";

export default class Accordion extends PreactComponent<{}, { open: string }> {
  public static get observedAttributes() {
    return [];
  }

  public constructor() {
    super({ open: "" });
    this.SetChild({ title: IsString }, function ({ title }, parent) {
      const id = useMemo(() => Guid(), []);
      const [height, set_height] = useState(0);

      const ref = useRef<HTMLDivElement>(null);
      const open = parent.Current === id;

      useEffect(() => {
        if (!ref.current) return;
        set_height(ref.current.clientHeight);
      }, [ref.current]);

      return WithStyles(
        <>
          <div class="item-heading" onClick={() => (parent.Current = id)}>
            <p-text variant="h6" no-margin>
              {title}
            </p-text>
            <p-icon
              name="arrow-down"
              size={CT.text.h6.Size}
              colour="body"
              text
            />
          </div>
          <div class="container">
            <div class="content" ref={ref}>
              <slot />
            </div>
          </div>
        </>,
        Css.Init()
          .With(
            Rule.Init(".container")
              .With("overflow", "hidden")
              .With("height", open ? height + "px" : "0")
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
          )
      );
    });
  }

  protected override IsProps = {};
  protected override Render(props: {}) {
    return <slot />;
  }

  public set Current(current: string) {
    this.State = { ...this.State, open: current };
  }

  public get Current() {
    return this.State.open;
  }

  public static get IncludedTags(): string[] {
    return ["p-icon", "p-text"];
  }
}
