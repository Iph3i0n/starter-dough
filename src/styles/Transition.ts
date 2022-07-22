import { CssProperty } from "Src/CSS";
import { CT, Speed } from "Src/Theme";

export default class Transition extends CssProperty {
  private readonly targets: string[];

  public constructor(private readonly speed: Speed, ...targets: string[]) {
    super();
    this.targets = targets;
  }

  public override get Properties() {
    return [
      {
        name: "transition",
        value: this.targets
          .map((t) => `${t} ${CT.animation[this.speed]}`)
          .join(", "),
      },
    ];
  }
}
