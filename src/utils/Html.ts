import { Component } from "preact";

export function On<K extends keyof HTMLElementEventMap>(
  selector: string,
  event: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  const registered: HTMLElement[] = [];
  document.querySelectorAll(selector);
  for (const target of document.querySelectorAll(selector)) {
    const t: HTMLElement = target as any;
    registered.push(t);
    t.addEventListener(event, listener, options);
  }

  return () => {
    for (const target of registered)
      target.removeEventListener(event, listener, options);
  };
}

export function IsVisible(target: Element | null) {
  if (!target) return false;
  const rect = target.getBoundingClientRect();
  const height = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return !(rect.bottom < 0 || rect.top - height >= 0);
}

export function GetComponent(target: Component<any>): HTMLElement | undefined {
  const root: ShadowRoot = target.base?.getRootNode() as any;
  return root?.host as any;
}
