import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString } from "@paulpopat/safe-type";

Define(
  "p-paginator",
  { total: IsString },
  {},
  {
    render() {
      return <div />;
    },
  }
);
