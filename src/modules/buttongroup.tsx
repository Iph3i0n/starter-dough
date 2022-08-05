import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import WithStyles from "Src/utils/Styles";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent({}, (props) => {
  return WithStyles(
    <>{props.children}</>,
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
});
