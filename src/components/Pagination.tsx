import Jsx from "Src/Jsx";
import Define from "Src/Component";
import { IsString } from "@paulpopat/safe-type";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";
import Flex from "Src/styles/Flex";
import Transition from "Src/styles/Transition";

class PageEvent extends Event {
  public constructor(
    public readonly skip: number,
    public readonly take: number,
    public readonly total: number
  ) {
    super("page");
  }
}

Define(
  "p-paginator",
  { total: IsString, skip: IsString, take: IsString },
  {},
  {
    render() {
      const total = parseInt(this.Props.total);
      const skip = parseInt(this.Props.skip);
      const take = parseInt(this.Props.take);
      const page = Math.floor(skip / take);
      const click =
        (skip: number, take: number, total: number) => (e: MouseEvent) => {
          e.preventDefault();
          this.dispatchEvent(
            new PageEvent(
              Math.max(skip, 0),
              Math.min(skip, total - take),
              total
            )
          );
        };

      return (
        <nav>
          <a href="#" on_click={click(0, take, total)}>
            <p-icon
              name="arrow-left-s"
              size={CT.text.body_large.Size}
              colour="primary"
            />
          </a>
          <a href="#" on_click={click(skip - take, take, total)}>
            <p-icon
              name="arrow-drop-left"
              size={CT.text.body_large.Size}
              colour="primary"
            />
          </a>

          <a href="#" on_click={click(skip - take * 2, take, total)}>
            {Math.max(page - 2, 1).toString()}
          </a>

          <a href="#" on_click={click(skip - take, take, total)}>
            {Math.max(page - 1, 1).toString()}
          </a>

          <span>{page.toString()}</span>

          <a href="#" on_click={click(skip + take, take, total)}>
            {Math.min(page + 1, Math.floor(total / take)).toString()}
          </a>

          <a href="#" on_click={click(skip + take * 2, take, total)}>
            {Math.min(page + 2, Math.floor(total / take)).toString()}
          </a>

          <a href="#" on_click={click(skip + take, take, total)}>
            <p-icon
              name="arrow-drop-right"
              size={CT.text.body_large.Size}
              colour="primary"
            />
          </a>
          <a href="#" on_click={click(total - take, take, total)}>
            <p-icon
              name="arrow-right-s"
              size={CT.text.body_large.Size}
              colour="primary"
            />
          </a>
        </nav>
      );
    },
    css() {
      return Css.Init()
        .With(
          Rule.Init("a, span")
            .With(
              CT.text.body_large
                .WithPadding(CT.padding.block)
                .WithAlignment("center")
            )
            .With("text-decoration", "none")
            .With(new Flex("center", "center"))
        )
        .With(
          Rule.Init("a")
            .With(CT.colours.primary.AsText())
            .With(new Transition("fast", "opacity"))
            .With("modifier", Rule.Init(":hover").With("opacity", "0.5"))
        )
        .With(Rule.Init("span").With(CT.colours.faded_text))
        .With(
          Rule.Init("nav")
            .With(new Flex("center", "center"))
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With(CT.colours.surface)
        );
    },
  }
);
