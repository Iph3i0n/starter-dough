import PreactComponent from "./BuildComponent";
import { Rule } from "./CSS";
import { AddChunk, RemoveChunk } from "./PageStyles";

const starters = {} as Record<string, ReturnType<typeof Starter>>;

const started_css = Rule.Init("body").With("display", "block !important");

function Starter(
  tag: string,
  init: () => Promise<{ default: new () => PreactComponent<any> }>,
  observer: MutationObserver
) {
  const chunk = Rule.Init(tag).With("display", "none");
  AddChunk(chunk);

  let started = false;

  const result = () => {
    observer.disconnect();
    if (started) return;
    started = true;

    init().then(({ default: Component }) => {
      for (const tag of (Component as any).IncludedTags) {
        starters[tag] && starters[tag]();
      }

      try {
        customElements.define(tag, Component);
        RemoveChunk(chunk);
        AddChunk(started_css);
      } catch {
        console.error(`Attempting to add duplicate tag name ${tag}`);
      }
    });
  };

  starters[tag] = result;

  return result;
}

export default function AddComponent(
  tag: string,
  init: () => Promise<{ default: new () => PreactComponent<any> }>
) {
  const observer = new MutationObserver(() => {
    if (document.querySelector(tag)) {
      start();

      observer.disconnect();
    }
  });

  const start = Starter(tag, init, observer);

  if (document.querySelector(tag)) start();
  else
    document.addEventListener("DOMContentLoaded", function () {
      if (document.querySelector(tag)) start();
      else observer.observe(document.body, { childList: true, subtree: true });
    });
}
