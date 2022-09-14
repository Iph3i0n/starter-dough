import Css, { CssChunk, Rule } from "Src/CSS";
import Padding from "Src/styles/Padding";
import { CT } from "Src/Theme";
import Debounce from "./utils/Debounce";

const style = document.createElement("style");

let Rules = [
  Rule.Init("body")
    .With(CT.colours.body)
    .With(CT.text.body.WithPadding(new Padding("margin", "0"))),
  CT.font_urls.map((u) => `@import url("${u}");`).join(""),
] as CssChunk[];

const Render = Debounce(() => {
  let result = Css.Init();
  for (const rule of Rules) result = result.With(rule);
  style.textContent = result.toString();
});

export function AddChunk(chunk: CssChunk) {
  Rules = [...Rules.filter((c) => c !== chunk), chunk];
  Render();
}

export function RemoveChunk(chunk: CssChunk) {
  Rules = Rules.filter((r) => r !== chunk);
  Render();
}

if (document.head) document.head.append(style);
else
  document.addEventListener("DOMContentLoaded", () =>
    document.head.append(style)
  );

let result = Css.Init();
for (const rule of Rules) result = result.With(rule);
style.textContent = result.toString();
