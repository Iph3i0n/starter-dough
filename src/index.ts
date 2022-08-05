import AddComponent from "./AddComponent";
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

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

AddComponent("p-accordion", () => import("./modules/accordion"));
AddComponent("p-alert", () => import("./modules/alert"));
AddComponent("p-badge", () => import("./modules/badge"));
AddComponent("p-breadcrumbs", () => import("./modules/breadcrumbs"));
AddComponent("p-button", () => import("./modules/button"));
AddComponent("p-buttongroup", () => import("./modules/buttongroup"));
AddComponent("p-card", () => import("./modules/card"));
AddComponent("p-carousel", () => import("./modules/carousel"));
AddComponent("p-child", () => import("./modules/child"));
AddComponent("p-code", () => import("./modules/code"));
AddComponent("p-col", () => import("./modules/col"));
AddComponent("p-container", () => import("./modules/container"));
AddComponent("p-dropdown", () => import("./modules/dropdown"));
AddComponent("p-form", () => import("./modules/form"));
AddComponent("p-headrow", () => import("./modules/headrow"));
AddComponent("p-icon", () => import("./modules/icon"));
AddComponent("p-input", () => import("./modules/input"));
AddComponent("p-link", () => import("./modules/link"));
AddComponent("p-list", () => import("./modules/list"));
AddComponent("p-listgroup", () => import("./modules/listgroup"));
AddComponent("p-modal", () => import("./modules/modal"));
AddComponent("p-nav", () => import("./modules/nav"));
AddComponent("p-navbar", () => import("./modules/navbar"));
AddComponent("p-offcanvas", () => import("./modules/offcanvas"));
AddComponent("p-paginator", () => import("./modules/paginator"));
AddComponent("p-panel", () => import("./modules/panel"));
AddComponent("p-popover", () => import("./modules/popover"));
AddComponent("p-progress", () => import("./modules/progress"));
AddComponent("p-richtext", () => import("./modules/richtext"));
AddComponent("p-row", () => import("./modules/row"));
AddComponent("p-select", () => import("./modules/select"));
AddComponent("p-spacer", () => import("./modules/spacer"));
AddComponent("p-table", () => import("./modules/table"));
AddComponent("p-text", () => import("./modules/text"));
AddComponent("p-textarea", () => import("./modules/textarea"));
AddComponent("p-toast", () => import("./modules/toast"));
AddComponent("p-toggle", () => import("./modules/toggle"));
