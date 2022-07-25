import Jsx from "Src/Jsx";
import { IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import CreateContext from "Src/utils/Context";
import Css, { Rule } from "Src/CSS";
import { ColourNames, CT, GetColour, PreferDark } from "Src/Theme";
import Grid from "Src/styles/Grid";
import { IsOneOf } from "Src/utils/Type";

const Context = CreateContext([] as any[]);

Define(
  "p-table",
  {
    data: IsString,
    colour: Optional(IsOneOf(...ColourNames)),
  },
  {},
  {
    render() {
      this.Provide(Context, (window as any)[this.Props.data]);

      return (
        <div class="table">
          <div class="thead">
            <slot name="head" />
          </div>
          <div class="tbody">
            <slot />
          </div>
        </div>
      );
    },
    css() {
      let rule = Rule.Init(".table").With(CT.border.standard);

      if (this.Props.colour) rule = rule.With(GetColour(this.Props.colour));
      return Css.Init().With(rule);
    },
  }
);

const RowContext = CreateContext((key: string) => {});

Define(
  "p-data-row",
  {},
  { cells: [] as string[] },
  {
    render() {
      const data: any[] = this.Use(Context);
      this.Provide(
        RowContext,
        (key) => (this.State = { cells: [...this.State.cells, key] })
      );

      return (
        <>
          {data.map((d: any) => (
            <div class="tr">
              {this.State.cells.map((key) => (
                <div class="td">{d[key]}</div>
              ))}
            </div>
          ))}
        </>
      );
    },
    css() {
      return Css.Init()
        .With(
          Rule.Init(".tr")
            .With(CT.border.standard.WithDirection("bottom").WithRadius("0"))
            .With(new Grid(this.State.cells.length, CT.padding.small_block.X))
            .With(
              "modifier",
              Rule.Init(":nth-child(odd)").With(
                "background-color",
                PreferDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
              )
            )
        )
        .With(
          Rule.Init(".td")
            .With(CT.text.body.WithoutPadding())
            .With(CT.padding.small_block)
        );
    },
  }
);

Define(
  "p-data-cell",
  { key: IsString },
  {},
  {
    render() {
      const register = this.Use(RowContext);
      this.On("load", () => register(this.Props.key));
      return <slot />;
    },
  }
);

Define(
  "p-head-row",
  {},
  { child: 0 },
  {
    render() {
      this.On("children", () => {
        this.State = { child: this.ChildElements.length };
      });
      return (
        <div class="tr">
          <slot />
        </div>
      );
    },
    css() {
      return Css.Init().With(
        Rule.Init(".tr")
          .With(CT.border.standard.WithDirection("bottom").WithRadius("0"))
          .With(new Grid(this.State.child, CT.padding.small_block.X))
      );
    },
  }
);

Define(
  "p-head-cell",
  {},
  {},
  {
    render() {
      return (
        <div class="th">
          <slot />
        </div>
      );
    },
    css() {
      return Css.Init().With(
        Rule.Init(".th")
          .With(CT.text.h6.WithoutPadding())
          .With(CT.padding.small_block)
      );
    },
  }
);
