import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import Flex from "Src/styles/Flex";
import { v4 as Guid } from "uuid";
import WithStyles from "Src/utils/Styles";
import { IsString } from "@paulpopat/safe-type";
import WithChild from "Src/contexts/WithChild";
import Context from "Src/contexts/Accordion";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  {},
  WithChild(
    ({ children }) => {
      const [open, set_open] = useState("");

      return (
        <Context.Provider
          value={{ click: (index) => set_open(index), current: open }}
        >
          {children}
        </Context.Provider>
      );
    },
    { title: IsString },
    ({ title, children }) => {
      const id = useMemo(() => Guid(), []);
      const { click, current } = useContext(Context);
      const [height, set_height] = useState(0);
      const ref = useRef<HTMLDivElement>(null);
      const open = current === id;

      useEffect(() => {
        if (!ref.current) return;
        set_height(ref.current.clientHeight);
      }, [ref.current]);

      return WithStyles(
        <>
          <div class="item-heading" onClick={() => click(id)}>
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
              {children}
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
    }
  )
);
