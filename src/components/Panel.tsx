import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { ColourNames, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import { IsOneOf } from "Src/utils/Type";

Define(
  "p-panel",
  { colour: IsOneOf(...ColourNames) },
  {},
  {
    render() {
      return <slot />;
    },
    css() {
      return Css.Init().With(
        Rule.Init(":host")
          .With(GetColour(this.Props.colour))
          .With("display", "block")
      );
    },
  }
);
