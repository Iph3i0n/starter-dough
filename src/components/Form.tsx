import Register from "Src/Register";
import { createContext, h } from "preact";
import Css, { Media, Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { ColourName, ColourNames, CT, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import Object from "Src/utils/Object";
import { CustomElement, IsOneOf } from "Src/utils/Type";
import { v4 as Guid } from "uuid";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import WithStyles from "Src/utils/Styles";
import "./Grid";
import { IsLiteral, IsString, Optional } from "@paulpopat/safe-type";

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      "p-form": CustomElement<{}>;
      "p-input": CustomElement<{
        name: string;
        help?: string;
        type: string;
        disabled?: true;
        default?: string;
        placeholder?: string;
      }>;
      "p-textarea": CustomElement<{
        name: string;
        help?: string;
        type: string;
        disabled?: true;
        default?: string;
        placeholder?: string;
      }>;
      "p-select": CustomElement<{
        name: string;
        help?: string;
        disabled?: true;
        default?: string;
        options: string | string[];
      }>;
      "p-toggle": CustomElement<{
        name: string;
        type: "radio" | "checkbox" | "switch";
        value?: string;
        disabled?: boolean;
        colour: ColourName;
      }>;
    }
  }
}

export const FormContext = createContext({
  get: (key: string) => "" as string,
  set: (key: string, value: string) => {},
  submit: () => {},
});

class FormSubmitEvent<T> extends Event {
  public readonly Value: Readonly<T>;

  public constructor(value: T) {
    super("submit");
    this.Value = Object.AsReadonly(value);
  }
}

Register("p-form", {}, (props) => {
  const [value, set_value] = useState({} as Record<string, string>);
  const ref = useRef<HTMLFormElement>(null);

  const submit = () =>
    ref.current?.getRootNode().dispatchEvent(new FormSubmitEvent(value));

  return WithStyles(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      ref={ref}
    >
      <FormContext.Provider
        value={{
          get: (key) => value[key] ?? "",
          set: (key, value) => set_value((v) => ({ ...v, [key]: value })),
          submit,
        }}
      >
        {props.children}
      </FormContext.Provider>
    </form>,
    Css.Init().With(
      Rule.Init(":host")
        .With("display", "block")
        .With("flex", "1")
        .With("width", "100%")
    )
  );
});

const InputRules = Css.Init()
  .With(Rule.Init(":host").With("display", "block").With("flex", "1"))
  .With(Rule.Init("label").With(CT.text.body).With("display", "block"))
  .With(
    Media.Init("min-width", CT.screen.md.breakpoint).With(
      Rule.Init("label:not(.for-textarea)")
        .With("text-align", "right")
        .With(
          "line-height",
          `calc((${CT.text.body.Size} * ${CT.text.body.LineHeight}) + (${CT.text.body.Padding.Y} * 2))`
        )
    )
  )
  .With(
    Rule.Init(".input")
      .With("width", "100%")
      .With("box-sizing", "border-box")
      .With(CT.text.body.WithPadding(CT.padding.input))
      .With(CT.colours.surface)
      .With("margin", "0")
      .With("appearance", "none")
      .With(new Transition("fast", "background-color"))
      .With(CT.border.standard)
      .With(CT.box_shadow.large)
  )
  .With(
    Rule.Init(".input[disabled]").With(CT.colours.body.GreyscaleTransform(99.9))
  )
  .With(
    Rule.Init(".input[disabled]").With(CT.colours.body.GreyscaleTransform(99.9))
  )
  .With(
    Rule.Init(".input:hover:not([disabled])").With(
      CT.colours.body.GreyscaleTransform(95)
    )
  )
  .With(
    Rule.Init(".help-text").With(CT.text.small).With(CT.colours.faded_text)
  );

Register(
  "p-input",
  {
    name: IsString,
    help: Optional(IsString),
    type: Optional(IsString),
    default: Optional(IsString),
    placeholder: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    "no-label": Optional(IsLiteral(true)),
  },
  (props) => {
    const id = useMemo(() => Guid(), []);
    const { get, set, submit } = useContext(FormContext);
    useEffect(() => set(props.name, props.default ?? ""), []);

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
          <input
            id={id}
            type={props.type ?? "text"}
            name={props.name}
            class="input"
            disabled={props.disabled ?? false}
            value={get(props.name)}
            placeholder={props.placeholder ?? undefined}
            onChange={(e: any) => set(props.name, e.currentTarget.value)}
            onKeyPress={(e: KeyboardEvent) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              set(props.name, (e.currentTarget as any)?.value ?? "");
              submit();
            }}
          />
          {props.help && <span class="help-text">{props.help}</span>}
        </p-col>
      </p-row>,
      InputRules
    );
  }
);

Register(
  "p-select",
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

Register(
  "p-textarea",
  {
    name: IsString,
    help: Optional(IsString),
    type: IsString,
    default: Optional(IsString),
    placeholder: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    "no-label": Optional(IsLiteral(true)),
  },
  (props) => {
    const id = useMemo(() => Guid(), []);
    const { get, set, submit } = useContext(FormContext);
    useEffect(() => set(props.name, props.default ?? ""), []);

    return WithStyles(
      <p-row flush>
        {!props["no-label"] && (
          <p-col xs="12">
            <label for={id} class="for-textarea">
              {props.children}
            </label>
          </p-col>
        )}
        <p-col xs="12">
          <textarea
            id={id}
            type={props.type ?? "text"}
            name={props.name}
            class="input"
            disabled={props.disabled ?? false}
            value={get(props.name)}
            placeholder={props.placeholder ?? undefined}
            onChange={(e: any) => set(props.name, e.currentTarget.value)}
            onKeyPress={(e: KeyboardEvent) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              set(props.name, (e.currentTarget as any)?.value ?? "");
              submit();
            }}
          />
          {props.help && <span class="help-text">{props.help}</span>}
        </p-col>
      </p-row>,
      InputRules.With(
        Rule.Init("textarea").With("height", "5rem").With("resize", "none")
      )
    );
  }
);

Register(
  "p-toggle",
  {
    name: IsString,
    help: Optional(IsString),
    type: IsString,
    default: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    value: IsString,
    colour: IsOneOf(...ColourNames),
  },
  (props) => {
    const { get, set } = useContext(FormContext);
    const value = get(props.name);
    const type = props.type === "radio" ? "radio" : "checkbox";
    const checked = type ? value.includes(props.value) : value === props.value;

    return WithStyles(
      <label class={C(["disabled", !!props.disabled])}>
        <input
          class={props.type}
          type={type}
          name={props.name}
          disabled={props.disabled ?? false}
          checked={checked}
          onClick={(e) => {
            e.preventDefault();
            if (props.type === "radio") set(props.name, props.value);
            else if (checked)
              set(
                props.name,
                value
                  .split(",")
                  .filter((v) => v !== props.value)
                  .join(",")
              );
            else
              set(props.name, value.split(",").concat(props.value).join(","));
          }}
        />
        {props.children}
      </label>,
      Css.Init()
        .With(
          Rule.Init("label")
            .With(new Flex("center", "flex-start"))
            .With(CT.text.body)
            .With("user-select", "none")
        )
        .With(Rule.Init(".disabled").With("opacity", "0.5"))
        .With(
          Rule.Init(".radio, .checkbox, .switch")
            .With("-webkit-appearance", "none")
            .With("appearance", "none")
            .With("background-color", "transparent")
            .With("margin", "0")
            .With(CT.padding.block)
            .With(new Transition("fast", "border-color", "background-color"))
            .With("height", CT.text.body.Size)
            .With(CT.border.check)
            .With(CT.box_shadow.small)
            .With("padding", "0")
        )
        .With(
          Rule.Init(".radio, .checkbox")
            .With("width", CT.text.body.Size)
            .With("padding", CT.border.check.Width)
        )
        .With(
          Rule.Init(".switch")
            .With("width", `calc(${CT.text.body.Size} * 2)`)
            .With("border-radius", CT.text.body.Size)
            .With("postion", "relative")
        )
        .With(
          Rule.Init(".switch::after")
            .With("content", "' '")
            .With(
              new Absolute({
                top: CT.border.check.Width,
                left: CT.border.check.Width,
                width: `calc(${CT.text.body.Size} / 2)`,
                height: `calc(${CT.text.body.Size} / 2)`,
              })
            )
            .With(CT.colours.contrast)
            .With(new Transition("fast", "left", "background-color"))
            .With("border-radius", CT.text.body.Size)
        )
        .With(Rule.Init(".radio").With("border-radius", CT.text.body.Size))
        .With(
          Rule.Init("input[checked]")
            .With("border-color", GetColour(props.colour).Hex)
            .With("background-color", GetColour(props.colour).Hex)
        )
        .With(
          Rule.Init(".switch[checked]::after")
            .With("border-color", GetColour(props.colour).Hex)
            .With("left", `calc(100% - (${CT.border.check.Width} * 5))`)
        )
    );
  }
);
