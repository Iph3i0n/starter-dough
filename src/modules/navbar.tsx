import WithStyles from "Src/utils/Styles";
import { IsString, Optional } from "@paulpopat/safe-type";
import { IsOneOf } from "Src/utils/Type";
import { ColourNames, CT, GetColour } from "Src/Theme";
import Colour from "Src/styles/Colour";
import Css, { Media, Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import PreactComponent, { FromProps, IsProps } from "Src/BuildComponent";
import { useEffect } from "preact/hooks";

const Props = { icon: IsString, bg: Optional(IsOneOf(...ColourNames)) };

export default class Navbar extends PreactComponent<
  typeof Props,
  { colour: Colour }
> {
  public static get observedAttributes() {
    return Object.keys(Props);
  }

  public get Colour() {
    return this.State.colour;
  }

  public constructor() {
    super();
    this.SetChild(
      { href: Optional(IsString), id: Optional(IsString) },
      function (props, parent) {
        const colour = parent.Colour;
        const styles = Css.Init()
          .With(
            Rule.Init("a, span")
              .With("display", "inline-block")
              .With(CT.text.h6)
              .With("text-decoration", "none")
              .With(new Colour([0, 0, 0, 0], colour.Text))
              .With("cursor", "pointer")
              .With("user-select", "none")
              .With(CT.padding.small_block.AsMargin().YOnly())
          )
          .With(
            Media.Init(`min-width`, CT.screen.sm.breakpoint).With(
              Rule.Init("a, span").With(CT.padding.input)
            )
          );
        if (props.href) {
          return WithStyles(
            <a href={props.href} id={props.id ?? undefined}>
              <slot />
            </a>,
            styles
          );
        }

        return WithStyles(
          <span id={props.id ?? undefined}>
            <slot />
          </span>,
          styles
        );
      }
    );
  }

  protected IsProps = Props;

  protected Render(props: FromProps<typeof Props>) {
    const colour = GetColour(props.bg ?? "surface");
    useEffect(() => {
      this.State = { colour };
    }, []);

    return WithStyles(
      <nav>
        <p-container flush>
          <p-row flush>
            <p-child xs="12" md="2" lg="1" centre>
              <div class="icon-area">
                <img src={props.icon} alt="" />
              </div>
            </p-child>
            <p-child xs="12" md="6" centre>
              <div class="section">
                <slot />
              </div>
            </p-child>
            <p-child xs="12" md="4" lg="5" centre>
              <div class="section right">
                <slot name="right" />
              </div>
            </p-child>
          </p-row>
        </p-container>
      </nav>,
      Css.Init()
        .With(Rule.Init("nav").With(colour).With(CT.padding.block))
        .With(Rule.Init(".icon-area").With(new Flex("center", "space-between")))
        .With(
          Rule.Init("img")
            .With("max-height", "3rem")
            .With("border-radius", CT.border.small.Radius)
        )
        .With(
          Rule.Init(".section")
            .With(new Flex("flex-start", "flex-start", { direction: "column" }))
            .With("flex", "1")
            .With(
              "modifier",
              Rule.Init(".right").With(
                new Flex("flex-start", "flex-start", { direction: "column" })
              )
            )
        )
        .With(
          Media.Init(`min-width`, CT.screen.sm.breakpoint).With(
            Rule.Init(".section")
              .With(new Flex("center", "flex-start", { direction: "row" }))
              .With(
                "modifier",
                Rule.Init(".right").With(
                  new Flex("center", "flex-end", { direction: "row" })
                )
              )
          )
        )
    );
  }

  public static get IncludedTags(): string[] {
    return ["p-container", "p-row", "p-child"];
  }
}
