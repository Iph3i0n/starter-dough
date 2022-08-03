import Register from "Src/Register";
import { createContext } from "preact";
import WithStyles from "Src/utils/Styles";
import { IsString, Optional } from "@paulpopat/safe-type";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import Colour from "Src/styles/Colour";
import Css, { Media, Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import { useContext } from "preact/hooks";
import WithChild from "./Child";
import "./Grid";

const Context = createContext(new Colour("#000000"));

Register(
  "p-navbar",
  { icon: IsString, bg: Optional(IsOneOf(...ColourNames)) },
  WithChild(
    (props) => {
      const colour = GetColour(props.bg ?? "surface");

      return WithStyles(
        <Context.Provider value={colour}>
          <nav>
            <p-container flush>
              <p-row flush>
                <p-col xs="12" md="2" lg="1" centre>
                  <div class="icon-area">
                    <img src={props.icon} alt="" />
                  </div>
                </p-col>
                <p-col xs="12" md="6" centre>
                  <div class="section">{props.children}</div>
                </p-col>
                <p-col xs="12" md="4" lg="5" centre>
                  <div class="section right">
                    <slot name="right" />
                  </div>
                </p-col>
              </p-row>
            </p-container>
          </nav>
        </Context.Provider>,
        Css.Init()
          .With(Rule.Init("nav").With(colour).With(CT.padding.block))
          .With(
            Rule.Init(".icon-area").With(new Flex("center", "space-between"))
          )
          .With(
            Rule.Init("img")
              .With("max-height", "3rem")
              .With("border-radius", CT.border.small.Radius)
          )
          .With(
            Rule.Init(".section")
              .With(
                new Flex("flex-start", "flex-start", { direction: "column" })
              )
              .With("flex", "1")
              .With(
                "modifier",
                Rule.Init(".right").With(
                  new Flex("flex-start", "flex-start", { direction: "column" })
                )
              )
          )
          .With(
            Media.Init(`min-width`, CT.screen.sm.breakpoint).With(
              Rule.Init(".section")
                .With(new Flex("center", "flex-start", { direction: "row" }))
                .With(
                  "modifier",
                  Rule.Init(".right").With(
                    new Flex("center", "flex-end", { direction: "row" })
                  )
                )
            )
          )
      );
    },
    { href: Optional(IsString), id: Optional(IsString) },
    (props) => {
      const colour = useContext(Context);
      const styles = Css.Init()
        .With(
          Rule.Init("a, span")
            .With("display", "inline-block")
            .With(CT.text.h6)
            .With("text-decoration", "none")
            .With(new Colour([0, 0, 0, 0], colour.Text))
            .With("cursor", "pointer")
            .With("user-select", "none")
            .With(CT.padding.small_block.AsMargin().YOnly())
        )
        .With(
          Media.Init(`min-width`, CT.screen.sm.breakpoint).With(
            Rule.Init("a, span").With(CT.padding.input)
          )
        );
      if (props.href) {
        return WithStyles(
          <a href={props.href} id={props.id ?? undefined}>
            {props.children}
          </a>,
          styles
        );
      }

      return WithStyles(
        <span id={props.id ?? undefined}>{props.children}</span>,
        styles
      );
    }
  )
);
