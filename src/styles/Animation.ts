import { CssProperty } from "Src/CSS";
import { Speed } from "Src/Theme";

export default class Animation extends CssProperty {
  public constructor(
    private readonly name: string,
    private readonly duration: Speed
  ) {
    super();
  }

  public override get Properties() {
    return [
      { name: "animation-name", value: this.name },
      { name: "animation-duration", value: this.duration },
    ];
  }
}
