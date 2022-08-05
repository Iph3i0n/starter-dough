import Css, { Rule } from "Src/CSS";
import Absolute from "Src/styles/Absolute";
import Transition from "Src/styles/Transition";
import { CT } from "Src/Theme";

export default Css.Init()
  .With(
    Rule.Init(".container")
      .With(
        new Absolute({
          variant: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100vh",
          z_index: 999,
        })
      )
      .With(new Transition("slow", "opacity"))
      .With("opacity", "0")
      .With("pointer-events", "none")
  )
  .With(
    Rule.Init(".container.open")
      .With("opacity", "1")
      .With("pointer-events", "auto")
  )
  .With(
    Rule.Init(".close-button")
      .With(
        new Absolute({
          top: CT.padding.block.Top,
          right: CT.padding.block.Right,
        })
      )
      .With("cursor", "pointer")
      .With("opacity", "1")
      .With("text-decoration", "none")
      .With(new Transition("fast", "opacity"))
  )
  .With(Rule.Init(".close-button:hover").With("opacity", "0.5"))
  .With(
    Rule.Init(".backdrop")
      .With(
        new Absolute({
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        })
      )
      .With(CT.colours.contrast)
      .With("opacity", "0.7")
  );
