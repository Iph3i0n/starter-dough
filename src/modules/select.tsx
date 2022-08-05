import { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import { v4 as Guid } from "uuid";
import { useContext, useEffect, useMemo } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";
import FormContext from "Src/contexts/Form";
import InputRules from "Src/rules/Input";
import BuildComponent from "Src/BuildComponent";

export default BuildComponent(
  {
    name: IsString,
    help: Optional(IsString),
    default: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    options: IsString,
    "no-label": Optional(IsLiteral(true)),
  },
  (props) => {
    const id = useMemo(() => Guid(), []);
    const { get, set } = useContext(FormContext);
    useEffect(() => set(props.name, props.default ?? ""), []);
    const value = get(props.name);

    const options: string[] = Array.isArray(props.options)
      ? props.options
      : props.options.split(",");
    return WithStyles(
      <p-row flush>
        {!props["no-label"] && (
          <p-col xs="12" md="3" lg="2" centre align="right">
            <label for={id}>{props.children}</label>
          </p-col>
        )}
        <p-col
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
            onChange={(e) => set(props.name, e.currentTarget.value)}
          >
            {options.map((o: string) => (
              <option key={o} value={o} selected={value == o}>
                {o}
              </option>
            ))}
          </select>
          {props.help && <span class="help-text">{props.help}</span>}
          <p-icon name="arrow-down-s" size="35px" colour="body" text />
        </p-col>
      </p-row>,
      InputRules.With(Rule.Init("p-col").With("position", "relative")).With(
        Rule.Init("p-icon").With(new Absolute({ top: "0", right: "0" }))
      )
    );
  }
);
