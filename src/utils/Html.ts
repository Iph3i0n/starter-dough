export function GetIndexOfParent(target: Element) {
  const children = target.parentElement?.children;
  if (!children) return -1;
  for (let i = 0; i < children.length; i++)
    if (children.item(i) === target) return i;

  return -1;
}

export function IsFirstChild(target: Element) {
  return GetIndexOfParent(target) === 0;
}

export function IsLastChild(target: Element) {
  const children = target.parentElement?.children;
  const length = (children?.length ?? -1) - 1;
  return GetIndexOfParent(target) === length;
}

export function IsChildOf(target: Element, tag: string) {
  return target.parentElement?.tagName.toLowerCase() === tag;
}

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

  return {
    Off() {
      for (const target of registered)
        target.removeEventListener(event, listener, options);
    },
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
