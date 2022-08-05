import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import Object from "Src/utils/Object";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  { size: IsOneOf(...Object.Keys(CT.padding)) },
  (props) =>
    WithStyles(
      <></>,
      Css.Init().With(
        Rule.Init(":host").With("display", "block").With(CT.padding[props.size])
      )
    )
);
