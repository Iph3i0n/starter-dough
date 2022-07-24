import { CssProperty } from "Src/CSS";

export default class Flex extends CssProperty {
  public constructor(
    private readonly align: string,
    private readonly justify: string,
    private readonly schema?: {
      wrap?: boolean;
      direction?: "row" | "row-reverse" | "column" | "column-reverse";
      inline?: boolean;
    }
  ) {
    super();
  }

  public override get Properties() {
    const result = [
      { name: "display", value: this.schema?.inline ? "inline-flex" : "flex" },
      { name: "align-items", value: this.align },
      { name: "justify-content", value: this.justify },
    ];

    if (this.schema?.wrap) result.push({ name: "flex-wrap", value: "wrap" });
    if (this.schema?.direction)
      result.push({ name: "flex-direction", value: this.schema.direction });

    return result;
  }
}
