import { IsString } from "@paulpopat/safe-type";
import Define from "Src/Component";
import Jsx from "Src/Jsx";
import { ColourNames, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
// @ts-ignore: Importing CSS file content
import style from "remixicon/fonts/remixicon.css";

Define(
  "p-icon",
  {
    name: IsString,
    size: IsString,
    colour: IsOneOf(...ColourNames),
  },
  {},
  {
    render() {
      return <span class={`ri-${this.props.name}-line`} />;
    },
    css() {
      return {
        'span': {
          fontSize: this.props.size,
          color: GetColour(this.props.colour)?.Hex,
        },
      };
    },
    additional_css: style,
  }
);
