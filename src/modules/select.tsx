import { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import { v4 as Guid } from "uuid";
import { useEffect, useMemo } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import InputRules from "Src/rules/Input";
import FormComponent from "Src/utils/Form";
import { FromProps } from "Src/BuildComponent";
import Object from "Src/utils/Object";

const Props = {
  label: Optional(IsString),
  name: IsString,
  help: Optional(IsString),
  default: Optional(IsString),
  disabled: Optional(IsLiteral(true)),
  "no-label": Optional(IsLiteral(true)),
};

export default class Select extends FormComponent<typeof Props> {
  protected IsProps = Props;

  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  protected Render(props: FromProps<typeof Props>) {
    const id = useMemo(() => Guid(), []);
    useEffect(() => {
      this.value = props.default ?? "";
    }, [props.default]);
    return WithStyles(
      <p-row flush>
        {props.label && (
          <p-child xs="12" md="3" lg="2" centre align="right">
            <label for={id}>{props.label}</label>
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
            value={this.value?.toString()}
            onChange={(e) => (this.value = e.currentTarget.value)}
            dangerouslySetInnerHTML={{ __html: this.innerHTML }}
          />
          {props.help && <span class="help-text">{props.help}</span>}
          <p-icon name="arrow-down-s" size="22px" colour="surface" text />
        </p-child>
      </p-row>,
      InputRules.With(Rule.Init("p-child").With("position", "relative")).With(
        Rule.Init("p-icon").With(new Absolute({ right: "5px" }))
      )
    );
  }
}
