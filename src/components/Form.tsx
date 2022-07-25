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

class FormSubmitEvent<T> extends Event {
  public readonly Value: Readonly<T>;

  public constructor(value: T) {
    super("submit");
    this.Value = Object.AsReadonly(value);
  }
}

Define(
  "p-form",
  {},
  { value: {} as Record<string, string> },
  {
    render() {
      this.Provide(FormContext, {
        get: (key) => this.State.value[key] ?? "",
        set: (key, value) =>
          (this.State = { value: { ...this.State.value, [key]: value } }),
        submit: () => {
          this.dispatchEvent(new FormSubmitEvent(this.State.value));
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
      const { get, set, submit } = this.Use(FormContext);
      this.On("load", () => set(this.Props.name, this.Props.default ?? ""));
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
              type={this.Props.type ?? "text"}
              name={this.Props.name}
              class="input"
              disabled={this.Props.disabled}
              value={get(this.Props.name)}
              placeholder={this.Props.placeholder}
              on_change={(e: any) =>
                set(this.Props.name, e.currentTarget.value)
              }
              on_keypress={(e: KeyboardEvent) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                set(this.Props.name, (e.currentTarget as any)?.value ?? "");
                submit();
              }}
            />
            {this.Props.help && (
              <span class="help-text">{this.Props.help}</span>
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
      const { get, set } = this.Use(FormContext);
      this.On("load", () => set(this.Props.name, this.Props.default));
      const options = Object.Keys(this.Props).filter((o) => o.startsWith("o-"));
      const value = get(this.Props.name);
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
              name={this.Props.name}
              class="input"
              disabled={this.Props.disabled}
              on_change={(e: any) =>
                set(this.Props.name, e.currentTarget.value)
              }
            >
              {options.map((o) => (
                <option
                  value={o.replace("o-", "")}
                  selected={value == o.replace("o-", "")}
                >
                  {this.Props[o]}
                </option>
              ))}
            </select>
            {this.Props.help && (
              <span class="help-text">{this.Props.help}</span>
            )}
            <p-icon name="arrow-down-s" size="35px" colour="body" text />
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
      const { get, set } = this.Use(FormContext);
      this.On("load", () => set(this.Props.name, this.Props.default ?? ""));
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
              type={this.Props.type ?? "text"}
              name={this.Props.name}
              class="input"
              disabled={this.Props.disabled}
              placeholder={this.Props.placeholder}
              on_change={() =>
                set(
                  this.Props.name,
                  this.Root.querySelector("textarea")?.value ?? ""
                )
              }
            >
              {get(this.Props.name)}
            </textarea>
            {this.Props.help && (
              <span class="help-text">{this.Props.help}</span>
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
      const { get, set } = this.Use(FormContext);
      const value = get(this.Props.name);
      const type = this.Props.type === "radio" ? "radio" : "checkbox";
      const checked = type
        ? value.includes(this.Props.value)
        : value === this.Props.value;
      return (
        <label class={C(["disabled", !!this.Props.disabled])}>
          <input
            class={this.Props.type}
            type={type}
            name={this.Props.name}
            disabled={this.Props.disabled}
            checked={checked}
            on_click={(e: any) => {
              e.preventDefault();
              if (this.Props.type === "radio")
                set(this.Props.name, this.Props.value);
              else if (checked)
                set(
                  this.Props.name,
                  value
                    .split(",")
                    .filter((v) => v !== this.Props.value)
                    .join(",")
                );
              else
                set(
                  this.Props.name,
                  value.split(",").concat(this.Props.value).join(",")
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
            .With("border-color", GetColour(this.Props.colour).Hex)
            .With("background-color", GetColour(this.Props.colour).Hex)
        )
        .With(
          Rule.Init(".switch[checked]::after")
            .With("border-color", GetColour(this.Props.colour).Hex)
            .With("left", `calc(100% - (${CT.border.check.Width} * 5))`)
        );
    },
  }
);
