import Css, { Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import { CT } from "Src/Theme";

document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent =
    Css.Init()
      .With(
        Rule.Init("body")
          .With(CT.colours.body)
          .With(CT.text.body.WithPadding(new Padding("margin", "0")))
      )
      .toString() + CT.font_urls.map((u) => `@import url("${u}");`);

  document.head.append(style);
});
