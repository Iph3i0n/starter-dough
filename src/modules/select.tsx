import { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
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
  default: Optional(IsString),
  disabled: Optional(IsLiteral(true)),
  options: IsString,
  "no-label": Optional(IsLiteral(true)),
};

export default class Select extends FormComponent<typeof Props> {
  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const id = useMemo(() => Guid(), []);
    useEffect(() => {
      this.value = props.default ?? "";
    }, []);

    const options: string[] = Array.isArray(props.options)
      ? props.options
      : props.options.split(",");
    return WithStyles(
      <p-row flush>
        {!props["no-label"] && (
          <p-child xs="12" md="3" lg="2" centre align="right">
            <label for={id}>
              <slot />
            </label>
          </p-child>
        )}
        <p-child
          xs="12"
          md={props["no-label"] ? undefined : "9"}
          lg={props["no-label"] ? undefined : "10"}
          centre
        >
          <select
            id={id}
            name={props.name}
            class="input"
            disabled={props.disabled ?? false}
            onChange={(e) => (this.value = e.currentTarget.value)}
          >
            {options.map((o: string) => (
              <option key={o} value={o} selected={this.value == o}>
                {o}
              </option>
            ))}
          </select>
          {props.help && <span class="help-text">{props.help}</span>}
          <p-icon name="arrow-down-s" size="35px" colour="body" text />
        </p-child>
      </p-row>,
      InputRules.With(Rule.Init("p-child").With("position", "relative")).With(
        Rule.Init("p-icon").With(new Absolute({ top: "0", right: "0" }))
      )
    );
  }
}
