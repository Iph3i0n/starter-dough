import WithStyles from "Src/utils/Styles";
import { Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import { ColourNames, CT, GetColour, PreferDark } from "Src/Theme";
import Grid from "Src/styles/Grid";
import { IsOneOf } from "Src/utils/Type";
import { UseIndex, WithIndex } from "Src/utils/Index";
import WithChild from "Src/contexts/WithChild";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
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
              .With(index % 2 === 0 ? CT.colours.body : CT.colours.surface)
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
