import { v4 as Guid } from "uuid";
import { useEffect, useMemo } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import {
  IsBoolean,
  IsLiteral,
  IsString,
  IsUnion,
  Optional,
} from "@paulpopat/safe-type";
import InputRules from "Src/rules/Input";
import FormComponent from "Src/utils/Form";
import { FromProps } from "Src/BuildComponent";

const Props = {
  name: IsString,
  help: Optional(IsString),
  type: Optional(IsString),
  default: Optional(IsUnion(IsString, IsBoolean)),
  disabled: Optional(IsLiteral(true)),
};

export default class Input extends FormComponent<typeof Props> {
  protected IsProps = Props;

  public static get observedAttributes() {
    return Object.keys(Props);
  }

  protected Render(props: FromProps<typeof Props>) {
    const id = useMemo(() => Guid(), []);
    useEffect(() => {
      if (typeof props.default === "string") this.value = props.default ?? "";
    }, [props.default]);

    return WithStyles(
      <>
        <input
          id={id}
          type={props.type ?? "text"}
          name={props.name}
          class="input"
          disabled={props.disabled ?? false}
          value={this.value?.toString()}
          onChange={(e) => (this.value = e.currentTarget.value)}
          onKeyPress={(e: KeyboardEvent) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            this.value = (e.currentTarget as any).value;
            this.Submit();
          }}
          placeholder=" "
        />
        <label for={id}>
          <slot />
        </label>
        {props.help && <span class="help-text">{props.help}</span>}
      </>,
      InputRules
    );
  }

  public static get IncludedTags(): string[] {
    return ["p-row", "p-child"];
  }
}
