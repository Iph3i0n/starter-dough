import WithStyles from "Src/utils/Styles";
import { Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import { ColourNames, CT, GetColour, PreferDark } from "Src/Theme";
import Grid from "Src/styles/Grid";
import { IsOneOf } from "Src/utils/Type";
import PreactComponent, { FromProps } from "Src/BuildComponent";
import { UseChildElements } from "Src/utils/Hooks";

const Props = { colour: Optional(IsOneOf(...ColourNames)) };

export default class Table extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  public constructor() {
    super();
    this.SetChild({}, function (props) {
      this.SetChild({}, function (props) {
        return WithStyles(
          <slot />,
          Css.Init().With(
            Rule.Init(":host")
              .With("display", "block")
              .With(CT.text.body.WithoutPadding())
              .With(CT.padding.small_block)
          )
        );
      });

      const [ref, children] = UseChildElements();

      return WithStyles(
        <slot ref={ref} />,
        Css.Init().With(
          Rule.Init(":host")
            .With("display", "block")
            .With(CT.text.body.WithoutPadding())
            .With(new Grid(children.length, "0"))
            .With(
              "background-color",
              this.IndexOfParent % 2
                ? PreferDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)"
                : "transparent"
            )
        )
      );
    });
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const colour = GetColour(props.colour ?? "surface");
    return WithStyles(
      <div class="table">
        <div class="thead">
          <slot name="head" />
        </div>
        <div class="tbody">
          <slot />
        </div>
      </div>,
      Css.Init()
        .With(Rule.Init(".table").With(CT.border.standard).With(colour))
        .With(
          Rule.Init("p-child:nth-child(even)").With(
            colour.GreyscaleTransform(90)
          )
        )
    );
  }
}
