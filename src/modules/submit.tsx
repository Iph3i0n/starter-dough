import "element-internals-polyfill";
import "form-request-submit-polyfill";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import Colour from "Src/styles/Colour";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Absolute from "Src/styles/Absolute";
import PreactComponent, { FromProps } from "Src/BuildComponent";

const Props = {
  colour: IsOneOf(...ColourNames),
  outline: Optional(IsLiteral(true)),
};

export default class Submit extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  public static formAssociated = true;
  private readonly internals: ElementInternals;

  public constructor() {
    super();
    this.internals = this.attachInternals();
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    return WithStyles(
      <>
        <button
          type="submit"
          class="button"
          onClick={(e: any) => this.internals.form?.requestSubmit()}
        />
        <slot />
      </>,
      Css.Init()
        .With(
          Rule.Init(":host")
            .With(CT.text.body.WithPadding(CT.padding.input))
            .With("display", "inline-block")
            .With(
              props.outline
                ? CT.border.standard.WithColour(GetColour(props.colour))
                : CT.border.standard
            )
            .With("margin", "0")
            .With("cursor", "pointer")
            .With("user-select", "none")
            .With("position", "relative")
            .With(
              new Transition(
                "fast",
                "background-color",
                "color",
                "border-color"
              )
            )
            .With(
              props.outline
                ? new Colour([0, 0, 0, 0], GetColour(props.colour))
                : GetColour(props.colour)
            )
            .With(CT.box_shadow.large)
            .With("box-sizing", "border-box")
            .With(
              "modifier",
              Rule.Init("(:hover)").With(
                GetColour(props.colour).GreyscaleTransform(120, true)
              )
            )
        )
        .With(
          Rule.Init(".button")
            .With("opacity", "0")
            .With(
              new Absolute({
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
              })
            )
            .With("cursor", "pointer")
        )
    );
  }
}
