import PreactComponent, { FromProps } from "Src/BuildComponent";
import { JSX } from "preact/jsx-runtime";
import Object from "Src/utils/Object";
import ParseMarkdown, { Md } from "Src/utils/Markdown";
import { IsLiteral, IsString, PatternMatch } from "@paulpopat/safe-type";
import { h } from "preact";

const Props = {};

export default class Markdown extends PreactComponent<typeof Props> {
  public static get observedAttributes() {
    return Object.Keys(Props);
  }

  protected Render(props: FromProps<typeof Props>): JSX.Element {
    const data = ParseMarkdown(this.textContent);

    const RenderMd = (part: Md, i: number): JSX.Element => {
      if (IsString(part)) return <>{part}</>;
      else
        try {
          return PatternMatch(
            IsLiteral("h1"),
            IsLiteral("h2"),
            IsLiteral("h3"),
            IsLiteral("h4"),
            IsLiteral("h5"),
            IsLiteral("h6"),
            IsLiteral("p"),
            IsLiteral("ul"),
            IsLiteral("ol"),
            IsLiteral("a")
          )(
            () => <p-text variant="h1">{part.children.map(RenderMd)}</p-text>,
            () => <p-text variant="h2">{part.children.map(RenderMd)}</p-text>,
            () => <p-text variant="h3">{part.children.map(RenderMd)}</p-text>,
            () => <p-text variant="h4">{part.children.map(RenderMd)}</p-text>,
            () => <p-text variant="h5">{part.children.map(RenderMd)}</p-text>,
            () => <p-text variant="h6">{part.children.map(RenderMd)}</p-text>,
            () => <p-text variant="body">{part.children.map(RenderMd)}</p-text>,
            () => (
              <p-list variant="unordered">{part.children.map(RenderMd)}</p-list>
            ),
            () => (
              <p-list variant="ordered">{part.children.map(RenderMd)}</p-list>
            ),
            () => (
              <p-link href={part.attributes.href}>
                {part.children.map(RenderMd)}
              </p-link>
            )
          )(part.tag as any);
        } catch {
          return h(part.tag, part.attributes, ...part.children.map(RenderMd));
        }
    };

    return <>{data.map(RenderMd)}</>;
  }

  protected override IsProps = Props;

  public static get IncludedTags(): string[] {
    return ["p-text", "p-list", "p-link"];
  }
}
