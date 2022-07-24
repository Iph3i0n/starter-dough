import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString } from "@paulpopat/safe-type";
import { CT } from "Src/Theme";

Define(
  "p-paginator",
  { total: IsString, skip: IsString, take: IsString },
  {},
  {
    render() {
      return (
        <nav>
          <p-icon
            name="arrow-left-s"
            size={CT.text.body_large.Size}
            colour="body"
            text
          />
          <p-icon
            name="arrow-drop-left"
            size={CT.text.body_large.Size}
            colour="body"
            text
          />
          <p-icon
            name="arrow-drop-right"
            size={CT.text.body_large.Size}
            colour="body"
            text
          />
          <p-icon
            name="arrow-right-s"
            size={CT.text.body_large.Size}
            colour="body"
            text
          />
        </nav>
      );
    },
  }
);
