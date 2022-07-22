import {
  IsBoolean,
  IsLiteral,
  IsString,
  IsUnion,
  Optional,
} from "@paulpopat/safe-type";
import Define from "Src/Component";
import Css, { Media, Rule } from "Src/CSS";
import Jsx from "Src/Jsx";
import Absolute from "Src/styles/Absolute";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";
import { ColourNames, CT, GetColour } from "Src/Theme";
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
  { "on-submit": IsString },
  { value: {} as Record<string, string> },
  {
    render() {
      this.provide_context(FormContext, {
        get: (key) => this.state.value[key] ?? "",
        set: (key, value) =>
          this.set_state({ value: { ...this.state.value, [key]: value } }),
        submit: () => {
          const handle = this.props["on-submit"]
            ? (window as any)[this.props["on-submit"]]
            : () => {};
          handle(this.state.value);
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

const InputRules = Css.Init()
  .With(Rule.Init("label").With(CT.text.body).With("display", "block"))
  .With(
    Media.Init(`min-width: ${CT.screen.md.breakpoint}`).With(
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

Define(
  "p-input",
  {
    name: IsString,
    help: Optional(IsString),
    type: Optional(IsString),
    disabled: Optional(IsLiteral(true)),
    default: Optional(IsString),
    placeholder: Optional(IsString),
  },
  {},
  {
    render() {
      const id = Guid();
      const { get, set, submit } = this.use_context(FormContext);
      this.listen("load", () => set(this.props.name, this.props.default ?? ""));
      return (
        <p-row flush>
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
              placeholder={this.props.placeholder}
              on_change={(e: any) =>
                set(this.props.name, e.currentTarget.value)
              }
              on_keypress={(e: KeyboardEvent) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                set(this.props.name, (e.currentTarget as any)?.value ?? "");
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
      return InputRules;
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
        <p-row flush>
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
      return InputRules.With(
        Rule.Init("p-col").With("position", "relative")
      ).With(Rule.Init("p-icon").With(new Absolute({ top: "0", right: "0" })));
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
    placeholder: Optional(IsString),
  },
  {},
  {
    render() {
      const id = Guid();
      const { get, set } = this.use_context(FormContext);
      this.listen("load", () => set(this.props.name, this.props.default ?? ""));
      return (
        <p-row flush>
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
              placeholder={this.props.placeholder}
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
      return InputRules.With(
        Rule.Init("textarea").With("height", "5rem").With("resize", "none")
      );
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
      return Css.Init()
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
            .With("border-color", GetColour(this.props.colour).Hex)
            .With("background-color", GetColour(this.props.colour).Hex)
        )
        .With(
          Rule.Init(".switch[checked]::after")
            .With("border-color", GetColour(this.props.colour).Hex)
            .With("left", `calc(100% - (${CT.border.check.Width} * 5))`)
        );
    },
  }
);
