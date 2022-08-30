import Css, { Rule } from "Src/CSS";
import Transition from "Src/styles/Transition";
import { CT } from "Src/Theme";

export default Css.Init()
  .With(Rule.Init(":host").With("display", "block").With("flex", "1"))
  .With(Rule.Init("label").With(CT.text.body).With("display", "block"))
  .With(
    Rule.Init("label:not(.for-textarea)")
      .With("text-align", "right", "min-width:" + CT.screen.md.breakpoint)
      .With(
        "line-height",
        `calc((${CT.text.body.Size} * ${CT.text.body.LineHeight}) + (${CT.text.body.Padding.Y} * 2))`,
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
