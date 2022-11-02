import { Rule } from "Src/CSS";
import { v4 as Guid } from "uuid";
import { useEffect, useMemo } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import {
  IsBoolean,
  IsLiteral,
  IsString,
  Optional,
  IsUnion,
} from "@paulpopat/safe-type";
import InputRules from "Src/rules/Input";
import FormComponent from "Src/utils/Form";
import { FromProps } from "Src/BuildComponent";
import { CT } from "Src/Theme";

const Props = {
  name: IsString,
  help: Optional(IsString),
  default: Optional(IsUnion(IsString, IsBoolean)),
  disabled: Optional(IsLiteral(true)),
  code: Optional(IsLiteral(true)),
  height: Optional(IsString),
};

export default class Textarea extends FormComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const id = useMemo(() => Guid(), []);
    useEffect(() => {
      if (typeof props.default === "string") this.value = props.default ?? "";
    }, []);

    let rule = Rule.Init(".input")
      .With("height", props.height ?? "5rem")
      .With("resize", "none");

    if (props.code) rule = rule.With(CT.text.code.WithoutPadding());

    return WithStyles(
      <>
        <textarea
          id={id}
          name={props.name}
          class="input"
          disabled={props.disabled ?? false}
          value={this.value?.toString()}
          placeholder=" "
          onChange={(e) => (this.value = e.currentTarget.value)}
        />
        <label for={id} class="for-textarea">
          <slot />
        </label>
        {props.help && <span class="help-text">{props.help}</span>}
      </>,
      InputRules.With(rule)
    );
  }

  public static get IncludedTags(): string[] {
    return ["p-row", "p-child"];
  }
}
