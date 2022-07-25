import { CssProperty } from "Src/CSS";
import { AddToGlobalScope } from "Src/utils/Interface";

export default class Absolute extends CssProperty {
  public constructor(
    private readonly schema: {
      variant?: "fixed" | "absolute" | "relative";
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
      translate?: [string, string];
      width?: string;
      height?: string;
      z_index?: number;
    }
  ) {
    super();
  }

  public override get Properties() {
    const result = [
      { name: "position", value: this.schema.variant ?? "absolute" } as {
        name: string;
        value: string;
      },
    ];
    if (this.schema.top) result.push({ name: "top", value: this.schema.top });
    if (this.schema.bottom)
      result.push({ name: "bottom", value: this.schema.bottom });
    if (this.schema.left)
      result.push({ name: "left", value: this.schema.left });
    if (this.schema.right)
      result.push({ name: "right", value: this.schema.right });
    if (this.schema.width)
      result.push({ name: "width", value: this.schema.width });
    if (this.schema.height)
      result.push({ name: "height", value: this.schema.height });
    if (this.schema.translate)
      result.push({
        name: "tranform",
        value: `translate(${this.schema.translate[0]}, ${this.schema.translate[1]})`,
      });
    if (this.schema.z_index)
      result.push({ name: "z-index", value: this.schema.z_index.toString() });

    return result;
  }
}

export const Cover = new Absolute({
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
});

AddToGlobalScope("Absolute", Absolute);
