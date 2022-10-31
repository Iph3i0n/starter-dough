import Css, { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { ColourNames, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import {
  IsBoolean,
  IsLiteral,
  IsString,
  Optional,
  PatternMatch,
  IsUnion,
} from "@paulpopat/safe-type";
import { FromProps, IsProps } from "Src/BuildComponent";
import FormComponent from "Src/utils/Form";

const Props = {
  name: IsString,
  help: Optional(IsString),
  type: IsOneOf("radio", "checkbox", "toggle"),
  default: Optional(IsUnion(IsString, IsBoolean)),
  disabled: Optional(IsLiteral(true)),
  value: IsString,
  colour: IsOneOf(...ColourNames),
};

export default class Toggle extends FormComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const checked = PatternMatch(
      IsLiteral("radio"),
      IsLiteral("checkbox"),
      IsLiteral("toggle")
    )(
      () => this.value === props.value,
      () => this.value?.toString().includes(props.value),
      () => this.value === "yes"
    )(props.type);

    let styling = Css.Init()
      .With(
        Rule.Init("label")
          .With(new Flex("flex-start", "flex-start"))
          .With(CT.text.body)
          .With("user-select", "none")
          .With(CT.padding.input.AsMargin())
          .With("cursor", "pointer")
      )
      .With(Rule.Init(".disabled").With("opacity", "0.5"))
      .With(
        Rule.Init(".radio, .checkbox, .toggle")
          .With("-webkit-appearance", "none")
          .With("appearance", "none")
          .With("background-color", "transparent")
          .With("margin", "0")
          .With(CT.padding.block)
          .With(new Transition("fast", "border-color", "background-color"))
          .With("height", CT.text.body.Size)
          .With(CT.box_shadow.small)
          .With("padding", "0")
          .With(CT.padding.input.AsMargin().RightOnly())
          .With(CT.colours.surface)
      )
      .With(Rule.Init(".radio").With(CT.border.check))
      .With(Rule.Init(".checkbox").With(CT.border.check.WithRadius("2px")))
      .With(
        Rule.Init(".toggle")
          .With("width", `calc(${CT.text.body.Size} * 2)`)
          .With("border-radius", CT.text.body.Size)
          .With("position", "relative")
          .With(CT.border.check)
      )
      .With(
        Rule.Init(".radio, .checkbox")
          .With("width", CT.text.body.Size)
          .With("padding", CT.border.check.Width)
      )
      .With(
        Rule.Init(".toggle::after")
          .With("content", "' '")
          .With(
            new Absolute({
              top: CT.border.check.Width,
              left: CT.border.check.Width,
              width: `calc(${CT.text.body.Size} / 2)`,
              height: `calc(${CT.text.body.Size} / 2)`,
            })
          )
          .With(new Transition("fast", "left", "background-color"))
          .With("border-radius", CT.text.body.Size)
          .With(CT.colours.surface.BackgroundFromText())
      )
      .With(Rule.Init(".radio").With("border-radius", CT.text.body.Size));

    if (checked)
      styling = styling
        .With(
          Rule.Init(".radio, .checkbox, .toggle")
            .With("border-color", GetColour(props.colour).Hex)
            .With("background-color", GetColour(props.colour).Hex)
        )
        .With(
          Rule.Init(".toggle::after")
            .With("border-color", GetColour(props.colour).Hex)
            .With(GetColour(props.colour).BackgroundFromText())
            .With("left", `calc(100% - (${CT.border.check.Width} * 5))`)
        );

    return WithStyles(
      <label class={C(["disabled", !!props.disabled])}>
        <input
          class={props.type}
          type={PatternMatch(
            IsLiteral("radio"),
            IsLiteral("checkbox"),
            IsLiteral("toggle")
          )(
            () => "radio" as const,
            () => "checkbox" as const,
            () => "radio" as const
          )(props.type)}
          name={props.name}
          disabled={props.disabled ?? false}
          checked={checked}
          onClick={(e) => {
            e.preventDefault();
            PatternMatch(
              IsLiteral("radio"),
              IsLiteral("checkbox"),
              IsLiteral("toggle")
            )(
              () => (this.value = props.value),
              () =>
                (this.value = checked
                  ? this.value
                      ?.toString()
                      .split(",")
                      .filter((v) => v !== props.value)
                      .join(",") ?? ""
                  : [
                      ...(this.value?.toString().split(",") ?? []),
                      props.value,
                    ].join(",")),
              () => (this.value = this.value === "yes" ? "no" : "yes")
            )(props.type);
          }}
        />
        <slot />
      </label>,
      styling
    );
  }
}
