import WithStyles from "Src/utils/Styles";
import { ColourNames, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsOneOf } from "Src/utils/Type";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";

const Props = { colour: IsOneOf(...ColourNames) };

export default class Panel extends PreactComponent<typeof Props> {
  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    return WithStyles(
      <slot />,
      Css.Init().With(
        Rule.Init(":host")
          .With(GetColour(props.colour))
          .With("display", "block")
          .With("height", "100%")
      )
    );
  }
}
