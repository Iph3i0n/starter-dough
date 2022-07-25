import Jsx from "Src/Jsx";
import { IsLiteral, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import { FormContext } from "./Form";
import { GetIndexOfParent, IsChildOf } from "Src/utils/Html";
import CreateContext from "Src/utils/Context";
import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import Colour from "Src/styles/Colour";

const ButtonGroupContext = CreateContext(-1);

Define(
  "p-button",
  {
    colour: IsOneOf(...ColourNames),
    outline: Optional(IsLiteral(true)),
  },
  {},
  {
    render() {
      const props = this.Props as any;
      if ("href" in props)
        return (
          <a href={props.href} class="button">
            <slot />
          </a>
        );

      if (props.type === "submit") {
        const { submit } = this.Use(FormContext);
        return (
          <button {...props} class="button" on_click={(e: any) => submit()}>
            <slot />
          </button>
        );
      }

      return (
        <button type={props.type} class="button">
          <slot />
        </button>
      );
    },
    css() {
      const [sharp_left, sharp_right] = (() => {
        const is_group = IsChildOf(this, "p-button-group");
        if (!is_group) return [false, false];
        const length = this.Use(ButtonGroupContext);
        const index = GetIndexOfParent(this);
        return [index !== 0, index < length - 1];
      })();

      let rule = Rule.Init(".button")
        .With(CT.text.body.WithPadding(CT.padding.input))
        .With("display", "inline-block")
        .With(
          this.Props.outline
            ? CT.border.standard.WithColour(GetColour(this.Props.colour))
            : CT.border.standard
        )
        .With("margin", "0")
        .With("cursor", "pointer")
        .With("user-select", "none")
        .With("position", "relative")
        .With(
          new Transition("fast", "background-color", "color", "border-color")
        )
        .With(
          this.Props.outline
            ? new Colour([0, 0, 0, 0], GetColour(this.Props.colour))
            : GetColour(this.Props.colour)
        )
        .With(CT.box_shadow.large)
        .With("box-sizing", "border-box");

      if (sharp_left)
        rule = rule
          .With("border-top-left-radius", "0")
          .With("border-bottom-left-radius", "0");
      if (sharp_right)
        rule = rule
          .With("border-top-right-radius", "0")
          .With("border-bottom-right-radius", "0");
      return Css.Init()
        .With(rule)
        .With(
          Rule.Init(".button:hover").With(
            GetColour(this.Props.colour).GreyscaleTransform(120, true)
          )
        )
        .With(Rule.Init(":host").With("display", "inline-block"));
    },
  }
);

Define(
  "p-button-group",
  {},
  { children: -1 },
  {
    render() {
      this.Provide(ButtonGroupContext, this.State.children);
      this.On("children", () => {
        this.State = { children: this.ChildElements.length };
      });
      return <slot />;
    },
    css() {
      return Css.Init().With(Rule.Init(":host").With("font-size", "0"));
    },
  }
);
