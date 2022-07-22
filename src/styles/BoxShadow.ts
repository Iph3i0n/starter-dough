import { CssProperty } from "Src/CSS";
import Colour from "./Colour";

export default class BoxShadow extends CssProperty {
  public constructor(
    private readonly schema: {
      left?: string;
      top?: string;
      blur: string;
      spread?: string;
      colour?: Colour;
      style?: string;
    }
  ) {
    super();
  }

  public override get Properties() {
    const result = [];
    if (this.schema.colour)
      result.push({
        name: "box-shadow",
        value: [
          this.schema.left ?? "0px",
          this.schema.top ?? "0px",
          this.schema.blur,
          this.schema.spread ?? "0px",
          this.schema.colour.Hex,
          this.schema.style,
        ]
          .filter((c) => c)
          .join(" "),
      });

    return result;
  }
}
