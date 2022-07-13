import Jsx from "Src/Jsx";
import Define from "Src/Component";
import CreateContext from "Src/utils/Context";
import { IsString, Optional } from "@paulpopat/safe-type";
import { GetIndexOfParent } from "Src/utils/Html";
import { CT } from "Src/Theme";

type Crumb = { name: string; url: string };

const Context = CreateContext((index: number, name: string, url: string) => {});

Define(
  "p-breadcrumbs",
  {},
  { links: [] as Crumb[] },
  {
    render() {
      this.provide_context(Context, (index, name, url) => {
        const input = Array.isArray(this.state.links)
          ? [...this.state.links]
          : [];
        input[index] = { name, url };
        this.set_state({ links: input });
      });
      return (
        <nav>
          {Array.isArray(this.state.links) &&
            this.state.links.map(({ name, url }, i) => (
              <>
                {url ? <a href={url}>{name}</a> : <span>{name}</span>}
                {i !== this.state.links.length - 1 && <>/</>}
              </>
            ))}
        </nav>
      );
    },
    css() {
      return {
        nav: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          fontFamily: CT.text.font_family,
          fontSize: CT.text.size.body_large,
          fontWeight: CT.text.weight.display,
          lineHeight: CT.text.line_height,
          marginBottom: CT.padding.text_lg,
        },
        "a, span": {
          display: "inline-block",
          marginRight: CT.padding.block,
          marginLeft: CT.padding.block,
        },
        "a:first-child, span:first-child": {
          marginLeft: "0",
        },
        "a:last-child, span:last-child": {
          marginRight: "0",
        },
        a: {
          color: CT.colours.anchor,
          textDecoration: "none",
        },
        span: {
          color: CT.colours.body_fade,
        },
      };
    },
  }
);

Define(
  "p-crumb",
  { url: Optional(IsString) },
  {},
  {
    render() {
      const register = this.use_context(Context);
      this.listen("children", function () {
        register(
          GetIndexOfParent(this.ele),
          this.children.map((c) => c.textContent).join(" "),
          this.props.url ?? ""
        );
      });
      return <slot />;
    },
  }
);
