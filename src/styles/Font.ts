import { CssProperty } from "Src/CSS";
import { AddToGlobalScope } from "Src/utils/Interface";
import Padding from "./Padding";

export default class Font extends CssProperty {
  public constructor(
    private readonly schema: {
      style?: string;
      variant?: string;
      line_height?: string;
      align?: "left" | "right" | "center";
      decoration?: string;

      weight: string;
      size: string;
      family: string;
      padding: Padding;
      tag: string;
    }
  ) {
    super();
  }

  public override get Properties() {
    const result = [
      { name: "font-family", value: this.schema.family },
      { name: "font-size", value: this.schema.size },
      { name: "line-height", value: this.schema.line_height ?? "1.2" },
      { name: "font-weight", value: this.schema.weight },
      ...this.schema.padding.Properties,
    ];

    if (this.schema.style)
      result.push({ name: "font-style", value: this.schema.style });
    if (this.schema.variant)
      result.push({ name: "font-variant", value: this.schema.variant });
    if (this.schema.align)
      result.push({ name: "text-align", value: this.schema.align });
    if (this.schema.decoration)
      result.push({ name: "text-decoration", value: this.schema.decoration });

    return result;
  }

  public get Size() {
    return this.schema.size;
  }

  public get LineHeight() {
    return this.schema.line_height ?? "1.2";
  }

  public get Padding() {
    return this.schema.padding;
  }

  public get Tag() {
    return this.schema.tag;
  }

  public WithAlignment(align: "left" | "right" | "center") {
    return new Font({
      ...this.schema,
      align,
    });
  }

  public WithPadding(padding: Padding) {
    return new Font({
      ...this.schema,
      padding,
    });
  }

  public WithoutPadding() {
    return new Font({ ...this.schema, padding: new Padding("margin", "0") });
  }
}

AddToGlobalScope("Font", Font);
