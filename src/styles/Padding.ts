import { CssProperty } from "Src/CSS";

export default class Padding extends CssProperty {
  private readonly dimensions: string[];
  public constructor(
    private readonly variant: "padding" | "margin",
    ...dimensions: string[]
  ) {
    super();
    if (
      dimensions.length !== 1 &&
      dimensions.length !== 2 &&
      dimensions.length !== 4
    )
      throw new Error("Must be one, two, or four dimensions");
    this.dimensions = dimensions;
  }

  public override get Properties() {
    return [{ name: this.variant, value: this.dimensions.join(" ") }];
  }

  private SwitchOnLength<T>(
    one_handler: (args: [string]) => T,
    two_handler: (args: [string, string]) => T,
    four_handler: (args: [string, string, string, string]) => T
  ) {
    switch (this.dimensions.length) {
      case 1:
        return one_handler(this.dimensions as any);
      case 2:
        return two_handler(this.dimensions as any);
      case 4:
        return four_handler(this.dimensions as any);
    }

    throw new Error("Should not reach here. You have hacked something.");
  }

  public get X() {
    return this.SwitchOnLength(
      (d) => d[0],
      (d) => d[1],
      (d) => d[1]
    );
  }

  public get Y() {
    return this.SwitchOnLength(
      (d) => d[0],
      (d) => d[0],
      (d) => d[0]
    );
  }

  public get Top() {
    return this.SwitchOnLength(
      (d) => d[0],
      (d) => d[0],
      (d) => d[0]
    );
  }

  public get Bottom() {
    return this.SwitchOnLength(
      (d) => d[0],
      (d) => d[0],
      (d) => d[2]
    );
  }

  public get Left() {
    return this.SwitchOnLength(
      (d) => d[0],
      (d) => d[1],
      (d) => d[3]
    );
  }

  public get Right() {
    return this.SwitchOnLength(
      (d) => d[0],
      (d) => d[1],
      (d) => d[1]
    );
  }

  public get Variant() {
    return this.variant;
  }

  public AsMargin() {
    return new Padding("margin", ...this.dimensions);
  }

  public AsPadding() {
    return new Padding("padding", ...this.dimensions);
  }

  public BottomOnly() {
    return new Padding(this.Variant, "0", "0", this.Bottom, "0");
  }

  public XOnly() {
    return new Padding(this.Variant, "0", this.X);
  }

  public YOnly() {
    return new Padding(this.Variant, this.Y, "0");
  }

  public LeftOnly() {
    return new Padding(this.Variant, "0", "0", "0", this.Left);
  }

  public WithX(target: Padding) {
    return new Padding(
      this.Variant,
      this.Top,
      target.Right,
      this.Bottom,
      target.Left
    );
  }
}
