import PreactComponent from "./BuildComponent";

export default function AddComponent(
  tag: string,
  init: () => Promise<{ default: new () => PreactComponent<any> }>
) {
  const start = () =>
    init().then(({ default: Component }) => {
      try {
        customElements.define(tag, Component);
      } catch {
        console.error(`Attempting to add duplicate tag name ${tag}`);
      }
    });

  if (document.querySelector(tag)) {
    start();
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(tag)) {
      start();
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(tag)) {
        start();

        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}
