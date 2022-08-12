import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import { ColourNames, CT, GetColour } from "Src/Theme";
import WithStyles from "Src/utils/Styles";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";
import { IsOneOf } from "Src/utils/Type";

const Props = {
  colour: Optional(IsOneOf(...ColourNames)),
  href: IsString,
  target: Optional(IsString),
  disabled: Optional(IsLiteral(true)),
};

export default class Link extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    return WithStyles(
      <a href={props.href} target={props.target ?? undefined}>
        <slot />
      </a>,
      Css.Init().With(
        Rule.Init("a")
          .With(
            "disabled" in props
              ? GetColour(props.colour ?? "primary").AsText()
              : CT.colours.faded_text
          )
          .With("opacity", "1")
          .With(new Transition("fast", "opacity"))
          .With(
            "modifier",
            Rule.Init(":hover")
              .With("opacity", "0.7")
              .With("text-deoration", "underline")
          )
          .With("text-decoration", "none")
          .With("cursor", "pointer")
      )
    );
  }
}
