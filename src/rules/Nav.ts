import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import { CT } from "Src/Theme";

export default Css.Init().With(
  Rule.Init("nav")
    .With(new Flex("center", "flex-start", { wrap: true }))
    .With(CT.text.body_large)
    .With("width", "100%")
);
