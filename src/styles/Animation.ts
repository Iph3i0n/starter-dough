import { CssProperty } from "Src/CSS";
import { CT, Speed } from "Src/Theme";

export default class Animation extends CssProperty {
  public constructor(
    private readonly name: string,
    private readonly duration: Speed,
    private readonly repeat?: string
  ) {
    super();
  }

  public override get Properties() {
    const result = [
      { name: "animation-name", value: this.name },
      { name: "animation-duration", value: CT.animation[this.duration] },
      { name: "animation-timing-function", value: CT.animation_curve },
    ];

    if (this.repeat)
      result.push({ name: "animation-iteration-count", value: this.repeat });

    return result;
  }
}
