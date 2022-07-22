import Jsx from "Src/Jsx";
import Define from "Src/Component";
import CreateContext from "Src/utils/Context";
import {
  IsLiteral,
  IsString,
  IsUnion,
  Optional,
  PatternMatch,
} from "@paulpopat/safe-type";
import { GetIndexOfParent } from "Src/utils/Html";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import C from "Src/utils/Class";

type Crumb = { name: string; url: string; id?: string | null };

const Context = CreateContext(
  (index: number, name: string, url: string, id?: string | null) => {}
);

const NavStyles = Css.Init()
  .With(
    Rule.Init("nav")
      .With(new Flex("center", "flex-start"))
      .With(CT.text.body_large)
      .With("width", "100%")
  )
  .With(
    Rule.Init("a, span")
      .With("display", "inline-block")
      .With(CT.padding.input)
      .With("margin", "0")
  )
  .With(Rule.Init("a:first-child, span:first-child").With("margin-left", "0"))
  .With(Rule.Init("a:last-child, span:last-child").With("margin-right", "0"))
  .With(Rule.Init("a").With(CT.colours.anchor).With("text-decoration", "none"))
  .With(Rule.Init("span").With(CT.colours.faded_text));

Define(
  "p-breadcrumbs",
  {},
  { links: [] as Crumb[] },
  {
    render() {
      this.provide_context(Context, (index, name, url, id) => {
        const input = Array.isArray(this.state.links)
          ? [...this.state.links]
          : [];
        input[index] = { name, url, id };
        this.set_state({ links: input });
      });
      return (
        <nav>
          {Array.isArray(this.state.links) &&
            this.state.links.map(({ name, url, id }, i) => (
              <>
                {url ? (
                  <a href={url} id={id}>
                    {name}
                  </a>
                ) : (
                  <span id={id}>{name}</span>
                )}
                {i !== this.state.links.length - 1 && <>/</>}
              </>
            ))}
        </nav>
      );
    },
    css() {
      return NavStyles;
    },
  }
);

Define(
  "p-nav",
  {
    align: Optional(
      IsUnion(
        IsLiteral("left"),
        IsLiteral("centre"),
        IsLiteral("right"),
        IsLiteral("spread")
      )
    ),
    column: Optional(IsLiteral(true)),
    tabs: Optional(IsLiteral(true)),
  },
  { links: [] as Crumb[] },
  {
    render() {
      this.provide_context(Context, (index, name, url, id) => {
        const input = Array.isArray(this.state.links)
          ? [...this.state.links]
          : [];
        input[index] = { name, url, id };
        this.set_state({ links: input });
      });
      return (
        <nav>
          {Array.isArray(this.state.links) &&
            this.state.links.map(({ name, url, id }, i) => (
              <>
                {url ? (
                  <a
                    href={url}
                    class={C([
                      "active",
                      url.toLowerCase() ===
                        window.location.pathname.toLowerCase(),
                    ])}
                    id={id}
                  >
                    {name}
                  </a>
                ) : (
                  <span
                    class={C([
                      "active",
                      url.toLowerCase() ===
                        window.location.pathname.toLowerCase(),
                    ])}
                    id={id}
                  >
                    {name}
                  </span>
                )}
              </>
            ))}
        </nav>
      );
    },
    css() {
      let result = NavStyles.With(
        Rule.Init("nav").With(
          new Flex(
            "flex-start",
            PatternMatch(
              IsLiteral("left"),
              IsLiteral("centre"),
              IsLiteral("right"),
              IsLiteral("spread")
            )(
              () => "flex-start",
              () => "center",
              () => "flex-end",
              () => "space-evenly"
            )(this.props.align ?? "left"),
            { direction: this.props.column ? "column" : "row" }
          )
        )
      );

      if (this.props.tabs)
        result = result.With(
          Rule.Init("a, span")
            .With(CT.border.standard.WithRadius("0").WithDirection("bottom"))
            .With(
              "modifier",
              Rule.Init(".active")
                .With(CT.border.standard.WithDirection("top", "left", "right"))
                .With("border-bottom-left-radius", "0")
                .With("border-bottom-right-radius", "0")
            )
            .With("modifier", Rule.Init(":last-child").With("flex", "1"))
        );
      else
        result = result.With(
          Rule.Init("a.active, span.active")
            .With(CT.colours.active)
            .With(CT.border.standard)
        );

      return result;
    },
  }
);

Define(
  "p-nav-item",
  { url: Optional(IsString), id: Optional(IsString) },
  {},
  {
    render() {
      const register = this.use_context(Context);
      this.listen("children", function () {
        register(
          GetIndexOfParent(this.ele),
          this.children.map((c) => c.textContent).join(" "),
          this.props.url ?? "",
          this.props.id
        );
      });
      return <slot />;
    },
  }
);
