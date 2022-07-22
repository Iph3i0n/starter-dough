import Jsx from "Src/Jsx";
import Define from "Src/Component";
import CreateContext from "Src/utils/Context";
import { IsString, Optional } from "@paulpopat/safe-type";
import Router from "Src/utils/Router";
import Css, { Rule } from "Src/CSS";
import { CT } from "Src/Theme";
import Transition from "Src/styles/Transition";

const Context = CreateContext([] as string[]);

Define(
  "p-route",
  {
    path: Optional(IsString),
    "query-key": Optional(IsString),
    "query-value": Optional(IsString),
    hash: Optional(IsString),
  },
  {},
  {
    render() {
      const covered = this.use_context(Context);
      const parsed_path = this.props.path?.split("/").filter((c) => c) ?? [];
      for (let i = 0; i < parsed_path.length; i++)
        if (Router.Pathname[i + covered.length] !== parsed_path[i])
          return <></>;

      if (this.props["query-key"]) {
        if (!Router.Query[this.props["query-key"]]) return <></>;
        if (
          this.props["query-value"] &&
          !Router.Query[this.props["query-key"]].includes(
            this.props["query-value"]
          )
        )
          return <></>;
      }

      if (this.props.hash && Router.Hash !== this.props.hash) return <></>;
      return <slot />;
    },
  }
);

Define(
  "p-link",
  {
    path: Optional(IsString),
    "query-key": Optional(IsString),
    "query-value": Optional(IsString),
  },
  {},
  {
    render() {
      const final_props = {
        ...this.props,
        path: undefined,
        "query-key": undefined,
        "query-value": undefined,
      };
      return (
        <a
          {...final_props}
          href={this.props.path}
          on_click={(e: MouseEvent) => {
            e.preventDefault();
            if (this.props.path) Router.PushUrl(this.props.path);
            if (this.props["query-key"] && this.props["query-value"])
              Router.PushQuery(
                { [this.props["query-key"]]: [this.props["query-value"]] },
                "join"
              );
            if (this.props["query-key"] && !this.props["query-value"])
              Router.DeleteQuery(this.props["query-key"]);
          }}
        >
          <slot />
        </a>
      );
    },
    css() {
      return Css.Init().With(
        Rule.Init("a")
          .With(
            this.props.path ||
              (this.props["query-key"] && this.props["query-value"])
              ? CT.colours.anchor
              : CT.colours.faded_text
          )
          .With("opacity", "1")
          .With(new Transition("fast", "opacity"))
          .With(
            "modifier",
            Rule.Init(":hover")
              .With("opacity", "0.7")
              .With("text-deoration", "underline")
          )
          .With("text-decoration", "none")
          .With("cursor", "pointer")
      );
    },
  }
);
