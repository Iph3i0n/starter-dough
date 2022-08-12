import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import Object from "Src/utils/Object";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";

const Props = { size: IsOneOf(...Object.Keys(CT.padding)) };

export default class Spacer extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    return WithStyles(
      <></>,
      Css.Init().With(
        Rule.Init(":host").With("display", "block").With(CT.padding[props.size])
      )
    );
  }
}
