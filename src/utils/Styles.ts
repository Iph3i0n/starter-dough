import { Fragment, h, JSX } from "preact";
import Css from "Src/CSS";

export default function WithStyles(jsx: JSX.Element, styles: Css) {
  return h(Fragment, {}, jsx, h("style", {}, styles.toString()));
}
