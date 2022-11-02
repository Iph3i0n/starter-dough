import Css, { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Transition from "Src/styles/Transition";
import { CT } from "Src/Theme";

export default Css.Init()
  .With(
    Rule.Init(":host")
      .With("display", "block")
      .With("flex", "1")
      .With(CT.padding.input.YOnly())
      .With("position", "relative")
  )
  .With(
    Rule.Init("label")
      .With(CT.text.body)
      .With("display", "block")
      .With(
        new Absolute({ top: CT.padding.input.Top, left: CT.padding.input.Left })
      )
      .With(
        new Transition(
          "fast",
          "font-size",
          "top",
          "background-color",
          "padding"
        )
      )
  )
  .With(
    Rule.Init("label:not(.for-textarea)").With(
      "text-align",
      "right",
      "min-width:" + CT.screen.md.breakpoint
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
      .With(CT.border.standard)
      .With(
        "modifier",
        Rule.Init("[disabled]").With(CT.colours.body.GreyscaleTransform(99.9))
      )
      .With(
        "modifier",
        Rule.Init(":hover:not([disabled])").With(
          CT.colours.body.GreyscaleTransform(95)
        )
      )
      .With(
        "modifier",
        Rule.Init(":focus + label, :not(:placeholder-shown) + label")
          .With("top", "-12px")
          .With(CT.text.small)
          .With(CT.colours.surface)
          .With("padding", "2px 4px")
          .With("border-radius", "3px")
      )
  )
  .With(
    Rule.Init(".help-text")
      .With(CT.text.small)
      .With(CT.colours.faded_text)
      .With(CT.padding.input.XOnly())
  );
