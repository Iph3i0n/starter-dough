import WithStyles from "Src/utils/Styles";
import Css, { Rule } from "Src/CSS";
import { CT } from "Src/Theme";
import Grid from "Src/styles/Grid";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import { UseChildElements } from "Src/utils/Hooks";

export default class Headrow extends PreactComponent<{}> {
  public constructor() {
    super();
    this.SetChild({}, function (props) {
      return WithStyles(
        <div class="th">
          <slot />
        </div>,
        Css.Init().With(
          Rule.Init(".th")
            .With(CT.text.h6.WithoutPadding())
            .With(CT.padding.small_block)
        )
      );
    });
  }

  protected IsProps = {};

  protected Render(props: FromProps<{}>) {
    const [ref, children] = UseChildElements();
    return WithStyles(
      <div class="tr">
        <slot ref={ref} />
      </div>,
      Css.Init().With(
        Rule.Init(".tr")
          .With(CT.border.standard.WithDirection("bottom").WithRadius("0"))
          .With(new Grid(children.length, "0"))
      )
    );
  }
}
