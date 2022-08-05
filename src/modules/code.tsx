import { IsString, Optional } from "@paulpopat/safe-type";
import Css, { Rule } from "Src/CSS";
import { ColourNames, CT, GetColour } from "Src/Theme";
import { IsOneOf } from "Src/utils/Type";
import WithStyles from "Src/utils/Styles";
import { GetComponent } from "Src/utils/Html";
import BuildComponent from "Src/BuildComponent";
import Highlight from "highlight.js";

export default BuildComponent(
  { language: Optional(IsString), colour: Optional(IsOneOf(...ColourNames)) },
  function (props) {
    const colour = GetColour(props.colour ?? "surface");
    const html = Highlight.highlight(GetComponent(this)?.textContent ?? "", {
      language: props.language as any,
    }).value;

    return WithStyles(
      <code dangerouslySetInnerHTML={{ __html: html ?? "" }} />,
      Css.Init().With(
        Rule.Init("code")
          .With("white-space", "pre-wrap")
          .With("display", "block")
          .With(colour)
          .With(CT.padding.small_block)
          .With(CT.box_shadow.small)
          .With(CT.border.small)
          .With(
            "child",
            Rule.Init(".hljs-keyword,.hljs-name").With(
              CT.colours.danger.AsText()
            )
          )
          .With(
            "child",
            Rule.Init(".hljs-built_in,.hljs-property").With(
              CT.colours.warning.AsText()
            )
          )
          .With(
            "child",
            Rule.Init(".hljs-type,.hljs-attr").With(CT.colours.primary.AsText())
          )
          .With(
            "child",
            Rule.Init(".hljs-literal,.hljs-number").With(
              CT.colours.info.AsText()
            )
          )
          .With(
            "child",
            Rule.Init(".hljs-string").With(CT.colours.success.AsText())
          )
          .With(
            "child",
            Rule.Init(
              ".hljs-comment,.hljs-operator,.hljs-punctuation,.hljs-params"
            ).With(CT.colours.faded_text)
          )
      )
    );
  }
);
