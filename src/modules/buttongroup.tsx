import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import WithStyles from "Src/utils/Styles";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";
import { JSX } from "preact/jsx-runtime";

export default class ButtonGroup extends PreactComponent {
  protected Render(props: FromProps<{}>, state: any): JSX.Element {
    return WithStyles(
      <slot />,
      Css.Init()
        .With(Rule.Init(":host").With("font-size", "0"))
        .With(Rule.Init("p-button").With("border-radius", "0"))
        .With(
          Rule.Init("p-button:first-child")
            .With("border-top-left-radius", CT.border.standard.Radius)
            .With("border-bottom-left-radius", CT.border.standard.Radius)
        )
        .With(
          Rule.Init("p-button:last-child")
            .With("border-top-right-radius", CT.border.standard.Radius)
            .With("border-bottom-right-radius", CT.border.standard.Radius)
        )
    );
  }
  protected IsProps = {};
}
