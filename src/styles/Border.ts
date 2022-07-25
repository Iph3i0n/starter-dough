import { CssProperty } from "Src/CSS";
import { AddToGlobalScope } from "Src/utils/Interface";
import Colour from "./Colour";

const Directions = ["top", "bottom", "left", "right"] as const;
type Direction = typeof Directions[number];

export default class Border extends CssProperty {
  public constructor(
    private readonly schema: {
      width?: string;
      style?: string;
      colour?: Colour;
      radius?: string;
      at?: Direction[];
    }
  ) {
    super();
  }

  public override get Properties() {
    const result = [];
    if (this.schema.colour) {
      const border_string = `${this.schema.width ?? "1px"} ${
        this.schema.style ?? "solid"
      } ${this.schema.colour.Hex}`;
      if (this.schema.at)
        result.push(
          ...Directions.map((d) =>
            this.schema.at?.includes(d)
              ? { name: "border-" + d, value: border_string }
              : { name: "border-" + d, value: "none" }
          )
        );
      else result.push({ name: "border", value: border_string });
    }

    if (this.schema.radius)
      result.push({ name: "border-radius", value: this.schema.radius });

    return result;
  }

  public get Radius() {
    return this.schema.radius ?? "0";
  }

  public get Width() {
    return this.schema.width ?? "0";
  }

  public WithColour(colour: Colour) {
    return new Border({ ...this.schema, colour: colour });
  }

  public WithDirection(...direction: Direction[]) {
    return new Border({ ...this.schema, at: direction });
  }

  public WithRadius(radius: string) {
    return new Border({ ...this.schema, radius });
  }
}

AddToGlobalScope("Border", Border);
