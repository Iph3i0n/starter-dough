import WithStyles from "Src/utils/Styles";
import Css, { Rule } from "Src/CSS";
import { CT } from "Src/Theme";
import Grid from "Src/styles/Grid";
import { UseIndex, WithIndex } from "Src/utils/Index";
import WithChild from "Src/contexts/WithChild";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
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
