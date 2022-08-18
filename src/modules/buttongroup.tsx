import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import WithStyles from "Src/utils/Styles";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";
import { JSX } from "preact/jsx-runtime";

export default class ButtonGroup extends PreactComponent {
  public static get observedAttributes() {
    return Object.keys({});
  }

  protected Render(props: FromProps<{}>, state: any): JSX.Element {
    return WithStyles(
      <slot />,
      Css.Init()
        .With(
          Rule.Init(":host")
            .With("display", "inline-block")
            .With("font-size", "0")
            .With("overflow", "hidden")
            .With(CT.border.standard)
        )
        .With(
          Rule.Init("::slotted(p-button)")
            .With("border-radius", "0")
            .With("border", "none")
        )
    );
  }
  protected IsProps = {};
}
