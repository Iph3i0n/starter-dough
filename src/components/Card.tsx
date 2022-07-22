import Jsx from "Src/Jsx";
import { IsString, Optional } from "@paulpopat/safe-type";
import Define from "Src/Component";
import { CT } from "Src/Theme";
import Css, { Rule } from "Src/CSS";

Define(
  "p-card",
  {
    img: Optional(IsString),
    "img-alt": Optional(IsString),
  },
  {},
  {
    render() {
      return (
        <div class="card">
          {"img" in this.props && (
            <img
              src={this.props.img}
              alt={this.props["img-alt"]}
              class="card-img-top"
            />
          )}
          <div class="card-body">
            <h5 class="card-title">
              <slot name="title" />
            </h5>
            <slot />
          </div>
        </div>
      );
    },
    css() {
      return Css.Init()
        .With(
          Rule.Init(".card")
            .With(CT.colours.surface)
            .With(CT.border.standard)
            .With(CT.box_shadow.large)
            .With("overflow", "hidden")
            .With("position", "relative")
        )
        .With(
          Rule.Init(".card .card-img-top")
            .With("display", "block")
            .With("max-width", "100%")
            .With("object-fit", "cover")
            .With(CT.colours.contrast)
            .With(CT.text.body.WithAlignment("center"))
            .With(CT.border.standard.WithDirection(["bottom"]))
        )
        .With(Rule.Init(".card .card-body").With(CT.padding.block))
        .With(
          Rule.Init(".card .card-title")
            .With(CT.text.body_large)
            .With(CT.padding.block.AsMargin().BottomOnly())
        );
    },
  }
);
