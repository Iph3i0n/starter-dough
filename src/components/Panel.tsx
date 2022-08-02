import Register from "Src/Register";
import { h, Fragment } from "preact";
import WithStyles from "Src/utils/Styles";
import { ColourNames, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsOneOf } from "Src/utils/Type";

Register("p-panel", { colour: IsOneOf(...ColourNames) }, (props) =>
  WithStyles(
    <>{props.children}</>,
    Css.Init().With(
      Rule.Init(":host").With(GetColour(props.colour)).With("display", "block")
    )
  )
);
