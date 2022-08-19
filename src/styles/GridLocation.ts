import { IsNumber } from "@paulpopat/safe-type";
import { CssProperty } from "Src/CSS";
import { AddToGlobalScope } from "Src/utils/Interface";

type LocPropert = number | [number, number];

function ToString(property: LocPropert) {
  const position = IsNumber(property) ? "auto" : property[0].toString();
  const span = IsNumber(property)
    ? property.toString()
    : property[1].toString();

  return `${position} / span ${span}`;
}

export default class GridLocation extends CssProperty {
  public constructor(
    private readonly left: LocPropert,
    private readonly top?: LocPropert
  ) {
    super();
  }

  public override get Properties() {
    const result = [{ name: "grid-column", value: ToString(this.left) }];

    if (this.top) result.push({ name: "grid-row", value: ToString(this.top) });

    return result;
  }
}

AddToGlobalScope("GridLocation", GridLocation);
