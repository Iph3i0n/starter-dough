import MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import Object from "Src/utils/Object";

function ClearWhitespace(text: string) {
  return text
    .split("\n")
    .map((t) => t.trimStart())
    .join("\n");
}

export type Md =
  | { tag: string; attributes: Record<string, string>; children: Md[] }
  | string;

function* BuildTokens(tokens: Iterator<Token>): Generator<Md> {
  let part: IteratorResult<Token>;
  while ((part = tokens.next())) {
    if (part.done || part.value.type.endsWith("_close")) return;

    const attr = Object.MapArray(part.value.attrs ?? [], ([key, value]) => ({
      [key]: value,
    }));

    if (part.value.type.endsWith("_open"))
      yield {
        tag: part.value.tag,
        attributes: attr,
        children: [...BuildTokens(tokens)],
      };

    if (part.value.type === "inline")
      yield* BuildTokens(part.value.children?.values() ?? [].values());

    if (part.value.type === "text") yield part.value.content;

    if (part.value.type.endsWith("_inline"))
      yield {
        tag: part.value.tag,
        attributes: attr,
        children: [part.value.content],
      };
  }
}

export default function ParseMarkdown(text: string | null) {
  const parser = new MarkdownIt({
    linkify: true,
  });
  const parsed = parser.parse(ClearWhitespace(text ?? ""), {});
  return [...BuildTokens(parsed.values())];
}
