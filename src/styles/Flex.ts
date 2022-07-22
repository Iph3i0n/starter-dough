import { CssProperty } from "Src/CSS";

export default class Flex extends CssProperty {
  public constructor(
    private readonly align: string,
    private readonly justify: string,
    private readonly wrap?: boolean
  ) {
    super();
  }

  public override get Properties() {
    const result = [
      { name: "display", value: "flex" },
      { name: "align-items", value: this.align },
      { name: "justify-content", value: this.justify },
    ];

    if (this.wrap) result.push({ name: "flex-wrap", value: "wrap" });

    return result;
  }
}
