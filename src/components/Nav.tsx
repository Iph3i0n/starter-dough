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
import { GetIndexOfParent, IsVisible } from "Src/utils/Html";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import C from "Src/utils/Class";

type Crumb = {
  name: string;
  url: string;
  id?: string | null;
  spy?: string | null;
};

const Context = CreateContext((index: number, data: Crumb) => {});

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
  .With(
    Rule.Init("a")
      .With(CT.colours.primary.AsText())
      .With("text-decoration", "none")
  )
  .With(Rule.Init("span").With(CT.colours.faded_text));

Define(
  "p-breadcrumbs",
  {},
  { links: [] as Crumb[] },
  {
    render() {
      this.Provide(Context, (index, { name, url, id }) => {
        const input = Array.isArray(this.State.links)
          ? [...this.State.links]
          : [];
        input[index] = { name, url, id };
        this.State = { links: input };
      });
      return (
        <nav>
          {Array.isArray(this.State.links) &&
            this.State.links.map(({ name, url, id }, i) => (
              <>
                {url ? (
                  <a href={url} id={id}>
                    {name}
                  </a>
                ) : (
                  <span id={id}>{name}</span>
                )}
                {i !== this.State.links.length - 1 && <>/</>}
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
  { links: [] as Crumb[], visible: "" },
  {
    render() {
      this.Provide(Context, (index, { name, url, id, spy }) => {
        const input = Array.isArray(this.State.links)
          ? [...this.State.links]
          : [];
        input[index] = { name, url, id, spy };
        this.State = { ...this.State, links: input };
      });

      const is_active = (url: string, spy: string | null | undefined) => {
        if (spy && this.State.visible === spy) return true;
        if (url.toLowerCase() === window.location.pathname.toLowerCase())
          return true;
        return false;
      };

      this.On("load", () => {
        const handler = () => {
          for (const { spy } of this.State.links)
            if (!spy) continue;
            else if (IsVisible(document.querySelector(spy))) {
              if (this.State.visible !== spy)
                this.State = { ...this.State, visible: spy };
              return;
            }
        };

        document.addEventListener("scroll", handler);
        handler();
      });

      return (
        <nav>
          {Array.isArray(this.State.links) &&
            this.State.links.map(({ name, url, id, spy }) => (
              <>
                {url ? (
                  <a
                    href={url}
                    class={C(["active", is_active(url, spy)])}
                    id={id}
                  >
                    {name}
                  </a>
                ) : (
                  <span class={C(["active", is_active(url, spy)])} id={id}>
                    {name}
                  </span>
                )}
              </>
            ))}
          <span class="spacer" />
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
            )(this.Props.align ?? "left"),
            { direction: this.Props.column ? "column" : "row" }
          )
        )
      ).With(Rule.Init(".spacer").With("align-self", "flex-end"));

      if (this.Props.tabs)
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
            .With(CT.colours.primary)
            .With(CT.border.standard)
        );

      return result;
    },
  }
);

Define(
  "p-nav-item",
  { href: Optional(IsString), id: Optional(IsString), spy: Optional(IsString) },
  {},
  {
    render() {
      const register = this.Use(Context);
      this.On("children", () => {
        register(GetIndexOfParent(this), {
          name: this.textContent ?? "",
          url: this.Props.href ?? "",
          id: this.Props.id,
          spy: this.Props.spy,
        });
      });
      return <slot />;
    },
  }
);
