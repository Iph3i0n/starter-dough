import {
  IsBoolean,
  IsLiteral,
  IsString,
  IsUnion,
  Optional,
} from "@paulpopat/safe-type";
import Define from "Src/Component";
import Jsx from "Src/Jsx";
import { ColourNames, CT, FromText, GetColour } from "Src/Theme";
import C from "Src/utils/Class";
import CreateContext from "Src/utils/Context";
import Object from "Src/utils/Object";
import { IsOneOf } from "Src/utils/Type";
import { v4 as Guid } from "uuid";

export const FormContext = CreateContext({
  get: (key: string) => "" as string,
  set: (key: string, value: string) => {},
  submit: () => {},
});

Define(
  "p-form",
  { action: IsString, method: IsString },
  { value: {} as Record<string, string> },
  {
    render() {
      this.provide_context(FormContext, {
        get: (key) => this.state.value[key] ?? "",
        set: (key, value) =>
          this.set_state({ value: { ...this.state.value, [key]: value } }),
        submit: () => {
          console.log(this.state.value);
        },
      });

      return (
        <form on_submit={(e: any) => e.preventDefault()}>
          <slot />
        </form>
      );
    },
  }
);

const InputStyling = {
  label: {
    fontFamily: CT.text.font_family,
    fontSize: CT.text.size.body,
    display: "block",
    lineHeight: CT.text.line_height,
  },
  [`@media screen and (min-width: ${CT.screen.md.breakpoint})`]: {
    "label:not(.for-textarea)": {
      textAlign: "right",
      lineHeight: `calc((${CT.text.size.body} * ${CT.text.line_height}) + (${CT.padding.text_sm} * 2))`,
    },
  },
  ".input": {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: CT.text.font_family,
    fontSize: CT.text.size.body,
    padding: CT.padding.text_sm,
    background: GetColour(CT.colours.bg_surface),
    borderRadius: CT.border.radius,
    lineHeight: CT.text.line_height,
    margin: "0",
    appearance: "none",
    transition: `background-color ${CT.animation.time_fast}`,
    border: CT.border.standard_borders,
    boxShadow: CT.border.standard_box_shadow,
  },
  ".input[disabled]": {
    backgroundColor: GetColour(CT.colours.bg_white).GreyscaleTransform(99.9),
  },
  ".input:hover:not([disabled])": {
    backgroundColor: GetColour(CT.colours.bg_surface).GreyscaleTransform(95),
  },
  ".help-text": {
    fontSize: CT.text.size.small,
    fontFamily: CT.text.font_family,
    margin: `${CT.padding.text_sm} 0`,
    color: GetColour(CT.colours.body_fade),
  },
};

Define(
  "p-input",
  {
    name: IsString,
    help: Optional(IsString),
    type: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    default: Optional(IsString),
  },
  {},
  {
    render() {
      const id = Guid();
      const { get, set, submit } = this.use_context(FormContext);
      this.listen("load", () => set(this.props.name, this.props.default ?? ""));
      return (
        <p-row>
          <p-col xs="12" md="3" lg="2">
            <label for={id}>
              <slot />
            </label>
          </p-col>
          <p-col xs="12" md="9" lg="10">
            <input
              id={id}
              type={this.props.type ?? "text"}
              name={this.props.name}
              class="input"
              disabled={this.props.disabled}
              value={get(this.props.name)}
              on_change={(e: any) =>
                set(this.props.name, e.currentTarget.value)
              }
              on_keypress={(e: KeyboardEvent) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                submit();
              }}
            />
            {this.props.help && (
              <span class="help-text">{this.props.help}</span>
            )}
          </p-col>
        </p-row>
      );
    },
    css() {
      return InputStyling;
    },
  }
);

Define(
  "p-select",
  {
    name: IsString,
    help: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    default: IsString,
  },
  {},
  {
    render() {
      const id = Guid();
      const { get, set } = this.use_context(FormContext);
      this.listen("load", () => set(this.props.name, this.props.default));
      const options = Object.Keys(this.props).filter((o) => o.startsWith("o-"));
      const value = get(this.props.name);
      return (
        <p-row>
          <p-col xs="12" md="3" lg="2">
            <label for={id}>
              <slot />
            </label>
          </p-col>
          <p-col xs="12" md="9" lg="10">
            <select
              id={id}
              name={this.props.name}
              class="input"
              disabled={this.props.disabled}
              on_change={(e: any) =>
                set(this.props.name, e.currentTarget.value)
              }
            >
              {options.map((o) => (
                <option
                  value={o.replace("o-", "")}
                  selected={value == o.replace("o-", "")}
                >
                  {this.props[o]}
                </option>
              ))}
            </select>
            {this.props.help && (
              <span class="help-text">{this.props.help}</span>
            )}
            <p-icon name="arrow-down-s" size="35px" colour="dark" />
          </p-col>
        </p-row>
      );
    },
    css() {
      return {
        ...InputStyling,
        "p-col": { position: "relative" },
        "p-icon": {
          position: "absolute",
          top: "0",
          right: "0",
        },
      };
    },
  }
);

Define(
  "p-textarea",
  {
    name: IsString,
    help: Optional(IsString),
    type: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    default: Optional(IsString),
  },
  {},
  {
    render() {
      const id = Guid();
      const { get, set } = this.use_context(FormContext);
      this.listen("load", () => set(this.props.name, this.props.default ?? ""));
      return (
        <p-row>
          <p-col xs="12">
            <label for={id} class="for-textarea">
              <slot />
            </label>
          </p-col>
          <p-col xs="12">
            <textarea
              id={id}
              type={this.props.type ?? "text"}
              name={this.props.name}
              class="input"
              disabled={this.props.disabled}
              on_change={() =>
                set(
                  this.props.name,
                  this.root.querySelector("textarea")?.value ?? ""
                )
              }
            >
              {get(this.props.name)}
            </textarea>
            {this.props.help && (
              <span class="help-text">{this.props.help}</span>
            )}
          </p-col>
        </p-row>
      );
    },
    css() {
      return {
        ...InputStyling,
        textarea: {
          height: "5rem",
          resize: "none",
        },
      };
    },
  }
);

Define(
  "p-toggle",
  {
    name: IsString,
    type: IsUnion(
      IsLiteral("checkbox"),
      IsLiteral("radio"),
      IsLiteral("switch")
    ),
    value: IsString,
    disabled: Optional(IsLiteral(true)),
    checked: Optional(IsBoolean),
    colour: IsOneOf(...ColourNames),
  },
  {},
  {
    render() {
      const { get, set } = this.use_context(FormContext);
      const value = get(this.props.name);
      const type = this.props.type === "radio" ? "radio" : "checkbox";
      const checked = type
        ? value.includes(this.props.value)
        : value === this.props.value;
      return (
        <label class={C(["disabled", !!this.props.disabled])}>
          <input
            class={this.props.type}
            type={type}
            name={this.props.name}
            disabled={this.props.disabled}
            checked={checked}
            on_click={(e: any) => {
              e.preventDefault();
              if (this.props.type === "radio")
                set(this.props.name, this.props.value);
              else if (checked)
                set(
                  this.props.name,
                  value
                    .split(",")
                    .filter((v) => v !== this.props.value)
                    .join(",")
                );
              else
                set(
                  this.props.name,
                  value.split(",").concat(this.props.value).join(",")
                );
            }}
          />
          <slot />
        </label>
      );
    },
    css() {
      return {
        label: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          fontFamily: CT.text.font_family,
          fontSize: CT.text.size.body,
          lineHeight: CT.text.line_height,
          marginBottom: CT.padding.text_sm,
          userSelect: "none",
        },
        ".disabled": {
          opacity: "0.5",
        },
        ".radio, .checkbox, .switch": {
          "-webkit-appearance": "none",
          appearance: "none",
          backgroundColor: "transparent",
          backgroundClip: "content-box",
          margin: "0",
          marginRight: CT.padding.block,
          transition: `border-color ${CT.animation.time_fast}, background-color ${CT.animation.time_fast}`,
          height: CT.text.size.body,
          border: `${CT.border.width} solid ${
            GetColour(CT.colours.body_dark).Hex
          }`,
          padding: "0",
          boxShadow: CT.border.standard_box_shadow,
        },
        ".radio, .checkbox": {
          width: CT.text.size.body,
          padding: CT.border.width,
        },
        ".switch": {
          width: `calc(${CT.text.size.body} * 2)`,
          borderRadius: CT.text.size.body,
          position: "relative",
        },
        ".switch::after": {
          content: "' '",
          position: "absolute",
          top: CT.border.width,
          left: CT.border.width,
          width: `calc(${CT.text.size.body} / 2)`,
          height: `calc(${CT.text.size.body} / 2)`,
          background: GetColour(CT.colours.body_dark),
          transition: `left ${CT.animation.time_fast}, background-color ${CT.animation.time_fast}`,
          borderRadius: CT.text.size.body,
        },
        ".radio": {
          borderRadius: CT.text.size.body,
        },
        "input[checked]": {
          borderColor: GetColour(this.props.colour),
          backgroundColor: GetColour(this.props.colour),
        },
        ".switch[checked]::after": {
          backgroundColor: FromText(GetColour(this.props.colour)),
          left: `calc(100% - (${CT.border.width} * 5))`,
        },
      };
    },
  }
);
