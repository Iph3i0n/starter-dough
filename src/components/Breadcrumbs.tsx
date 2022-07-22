import Jsx from "Src/Jsx";
import Define from "Src/Component";
import CreateContext from "Src/utils/Context";
import { IsString, Optional } from "@paulpopat/safe-type";
import { GetIndexOfParent } from "Src/utils/Html";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";

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
      return Css.Init()
        .With(
          Rule.Init("nav")
            .With(new Flex("center", "flex-start"))
            .With(CT.text.body_large)
        )
        .With(
          Rule.Init("a, span")
            .With("display", "inline-block")
            .With(CT.padding.block.AsMargin().XOnly())
        )
        .With(
          Rule.Init("a:first-child, span:first-child").With(
            "margin-left",
            "0"
          )
        )
        .With(
          Rule.Init("a:last-child, span:last-child").With(
            "margin-right",
            "0"
          )
        )
        .With(
          Rule.Init("a")
            .With(CT.colours.anchor)
            .With("text-decoration", "none")
        )
        .With(Rule.Init("span").With(CT.colours.faded_text));
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
