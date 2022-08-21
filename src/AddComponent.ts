import PreactComponent from "./BuildComponent";

const starters = {} as Record<string, ReturnType<typeof Starter>>;

function Starter(
  tag: string,
  init: () => Promise<{ default: new () => PreactComponent<any> }>,
  observer: MutationObserver
) {
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
