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
      const props = this.props as any;
      if ("href" in props)
        return (
          <a {...props} class="button">
            <slot />
          </a>
        );

      if (props.type === "submit") {
        const { submit } = this.use_context(FormContext);
        return (
          <button {...props} class="button" on_click={(e: any) => submit()}>
            <slot />
          </button>
        );
      }

      const handler = props["on-click"];
      const on_click = handler ? (window as any)[handler] : () => {};
      return (
        <button {...props} class="button" on_click={(e: any) => on_click(e)}>
          <slot />
        </button>
      );
    },
    css() {
      const [sharp_left, sharp_right] = (() => {
        const is_group = IsChildOf(this.ele, "p-button-group");
        if (!is_group) return [false, false];
        const length = this.use_context(ButtonGroupContext);
        const index = GetIndexOfParent(this.ele);
        return [index !== 0, index < length - 1];
      })();

      let rule = Rule.Init(".button")
        .With(CT.text.body.WithPadding(CT.padding.input))
        .With("display", "inline-block")
        .With(
          this.props.outline
            ? CT.border.standard.WithColour(GetColour(this.props.colour))
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
          this.props.outline
            ? new Colour([0, 0, 0, 0], GetColour(this.props.colour))
            : GetColour(this.props.colour)
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
            GetColour(this.props.colour).GreyscaleTransform(120)
          )
        );
    },
  }
);

Define(
  "p-button-group",
  {},
  { children: -1 },
  {
    render() {
      this.provide_context(ButtonGroupContext, this.state.children);
      this.listen("children", function () {
        this.set_state({ children: this.child_elements.length });
      });
      return <slot />;
    },
    css() {
      return Css.Init().With(Rule.Init(":host").With("font-size", "0"));
    },
  }
);
