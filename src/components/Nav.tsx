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
import Router from "Src/utils/Router";

type Crumb = {
  index: number;
  name: string;
  id?: string | null;
  path: string | null | undefined;
  query_key: string | null | undefined;
  query_value: string | null | undefined;
};

const Context = CreateContext((item: Crumb) => {});

const NavStyles = Css.Init()
  .With(
    Rule.Init("nav")
      .With(new Flex("center", "flex-start"))
      .With(CT.text.body_large)
      .With("width", "100%")
  )
  .With(
    Rule.Init("p-link")
      .With("display", "inline-block")
      .With(CT.padding.input)
      .With("margin", "0")
  )
  .With(Rule.Init("p-link:first-child").With("margin-left", "0"))
  .With(Rule.Init("p-link:last-child").With("margin-right", "0"));

Define(
  "p-breadcrumbs",
  {},
  { links: [] as Crumb[] },
  {
    render() {
      this.provide_context(Context, (crumb) => {
        const input = Array.isArray(this.state.links)
          ? [...this.state.links]
          : [];
        input[crumb.index] = crumb;
        this.set_state({ links: input });
      });
      return (
        <nav>
          {Array.isArray(this.state.links) &&
            this.state.links.map((crumb, i) => (
              <>
                <p-link
                  id={crumb.id}
                  path={crumb.path}
                  query-key={crumb.query_key}
                  query-value={crumb.query_value}
                >
                  {crumb.name}
                </p-link>
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
      this.provide_context(Context, (crumb) => {
        const input = Array.isArray(this.state.links)
          ? [...this.state.links]
          : [];
        input[crumb.index] = crumb;
        this.set_state({ links: input });
      });
      return (
        <nav>
          {Array.isArray(this.state.links) &&
            this.state.links.map((crumb, i) => (
              <p-link
                id={crumb.id}
                path={crumb.path}
                query-key={crumb.query_key}
                query-value={crumb.query_value}
                class={C(["active", Router.At(crumb.path ?? "")])}
              >
                {crumb.name}
              </p-link>
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
          Rule.Init("p-link")
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
          Rule.Init("p-link.active")
            .With(CT.colours.active)
            .With(CT.border.standard)
        );

      return result;
    },
  }
);

Define(
  "p-nav-item",
  {
    path: Optional(IsString),
    "query-key": Optional(IsString),
    "query-value": Optional(IsString),
    id: Optional(IsString),
  },
  {},
  {
    render() {
      const register = this.use_context(Context);
      this.listen("children", function () {
        register({
          index: GetIndexOfParent(this.ele),
          name: this.children.map((c) => c.textContent).join(" "),
          path: this.props.path,
          query_key: this.props["query-key"],
          query_value: this.props["query-value"],
        });
      });
      return <slot />;
    },
  }
);
