import { CssProperty } from "Src/CSS";

export default class Grid extends CssProperty {
  public constructor(
    private readonly columns: number,
    private readonly gap: string
  ) {
    super();
  }

  public override get Properties() {
    return [
      { name: "display", value: "grid" },
      {
        name: "grid-template-columns",
        value: `repeat(${this.columns}, minmax(0, 1fr))`,
      },
      { name: "gap", value: this.gap },
    ];
  }
}
