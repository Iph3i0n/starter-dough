import { CssProperty } from "Src/CSS";
import { AddToGlobalScope } from "Src/utils/Interface";

export default class Grid extends CssProperty {
  public constructor(
    private readonly columns: number,
    private readonly gap: string,
    private readonly rows?: number
  ) {
    super();
  }

  public override get Properties() {
    const result = [
      { name: "display", value: "grid" },
      {
        name: "grid-template-columns",
        value: `repeat(${this.columns}, minmax(0, 1fr))`,
      },
      { name: "gap", value: this.gap },
    ];

    if (this.rows)
      result.push({
        name: "grid-template-rows",
        value: `repeat(${this.rows}, minmax(0, 1fr))`,
      });

    return result;
  }
}

AddToGlobalScope("Grid", Grid);
