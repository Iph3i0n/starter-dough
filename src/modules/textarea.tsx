import { Rule } from "Src/CSS";
import { v4 as Guid } from "uuid";
import { useEffect, useMemo } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import InputRules from "Src/rules/Input";
import FormComponent from "Src/utils/Form";
import { FromProps } from "Src/BuildComponent";

const Props = {
  name: IsString,
  help: Optional(IsString),
  type: IsString,
  default: Optional(IsString),
  placeholder: Optional(IsString),
  disabled: Optional(IsLiteral(true)),
  "no-label": Optional(IsLiteral(true)),
};

export default class Textarea extends FormComponent<typeof Props> {
  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const id = useMemo(() => Guid(), []);
    useEffect(() => {
      this.value = props.default ?? "";
    }, []);

    return WithStyles(
      <p-row flush>
        {!props["no-label"] && (
          <p-child xs="12">
            <label for={id} class="for-textarea">
              <slot />
            </label>
          </p-child>
        )}
        <p-child xs="12">
          <textarea
            id={id}
            type={props.type ?? "text"}
            name={props.name}
            class="input"
            disabled={props.disabled ?? false}
            value={this.value?.toString()}
            placeholder={props.placeholder ?? undefined}
            onChange={(e) => (this.value = e.currentTarget.value)}
            onKeyPress={(e: KeyboardEvent) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              this.Submit();
            }}
          />
          {props.help && <span class="help-text">{props.help}</span>}
        </p-child>
      </p-row>,
      InputRules.With(
        Rule.Init("textarea").With("height", "5rem").With("resize", "none")
      )
    );
  }
}
