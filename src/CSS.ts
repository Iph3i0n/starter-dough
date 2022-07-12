import { IsString } from "@paulpopat/safe-type";
import { IsColour } from "./utils/Colour";

function ToKebabCase(item: string) {
  let result = "";
  for (const char of item)
    if (char.toUpperCase() === char) result += "-" + char.toLowerCase();
    else result += char;

  return result;
}

export default function RenderCSS(css: any) {
  let result = "";
  for (const key in css)
    if (!css.hasOwnProperty(key)) continue;
    else if (IsColour(css[key]))
      result += ToKebabCase(key) + ":" + css[key].Hex + ";";
    else if (IsString(css[key]))
      result += ToKebabCase(key) + ":" + css[key] + ";";
    else result += key + "{" + RenderCSS(css[key]) + "}";

  return result;
}
