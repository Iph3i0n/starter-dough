import Register from "Src/Register";
import { createContext } from "preact";
import WithStyles from "Src/utils/Styles";
import { IsString, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import { ColourNames, CT, GetColour, PreferDark } from "Src/Theme";
import Grid from "Src/styles/Grid";
import { IsOneOf } from "Src/utils/Type";
import { useContext } from "preact/hooks";
import { UseIndex, WithIndex } from "Src/utils/Index";
import WithChild from "./Child";

Register(
  "p-table",
  { colour: Optional(IsOneOf(...ColourNames)) },
  WithChild(
    WithIndex((props) => {
      let rule = Rule.Init(".table").With(CT.border.standard);

      if (props.colour) rule = rule.With(GetColour(props.colour));
      return WithStyles(
        <div class="table">
          <div class="thead">
            <slot name="head" />
          </div>
          <div class="tbody">{props.children}</div>
        </div>,
        Css.Init().With(rule)
      );
    }),
    {},
    WithChild(
      WithIndex((props, total) => {
        const { index } = UseIndex();
        return WithStyles(
          <div class="tr">{props.children}</div>,
          Css.Init().With(
            Rule.Init(".tr")
              .With(CT.border.standard.WithDirection("bottom").WithRadius("0"))
              .With(new Grid(total, "0"))
              .With(
                "background-color",
                index % 2 === 0
                  ? PreferDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)"
                  : "transparent"
              )
          )
        );
      }),
      {},
      (props) => {
        UseIndex();
        return WithStyles(
          <div class="td">{props.children}</div>,
          Css.Init().With(
            Rule.Init(".td")
              .With(CT.text.body.WithoutPadding())
              .With(CT.padding.small_block)
          )
        );
      }
    )
  )
);

Register(
  "p-head-row",
  {},
  WithChild(
    WithIndex((props, total) =>
      WithStyles(
        <div class="tr">{props.children}</div>,
        Css.Init().With(
          Rule.Init(".tr")
            .With(CT.border.standard.WithDirection("bottom").WithRadius("0"))
            .With(new Grid(total, "0"))
        )
      )
    ),
    {},
    (props) => {
      UseIndex();
      return WithStyles(
        <div class="th">{props.children}</div>,
        Css.Init().With(
          Rule.Init(".th")
            .With(CT.text.h6.WithoutPadding())
            .With(CT.padding.small_block)
        )
      );
    }
  )
);
