import { IsString } from "@paulpopat/safe-type";
import EventManager from "./EventManager";
import { IsHtmlElement } from "./Type";

type Props = Record<string, string>;
type Handlers = Record<string, EventListenerOrEventListenerObject>;

export type ElementModel = {
  tag: string;
  props: Props;
  handlers: Handlers;
  children: NodeModel[];
};

export type NodeModel = ElementModel | string;

function ApplyProps(result: HTMLElement, props: Props) {
  for (const key in props ?? {})
    if (!props.hasOwnProperty(key) || !props[key]) continue;
    else if (IsString(props[key])) result.setAttribute(key, props[key]);
    else if (props[key]) result.setAttribute(key, "");
  for (const attribute of result.getAttributeNames())
    if (!props[attribute]) result.removeAttribute(attribute);
}

function ApplyHandlers(result: HTMLElement, props: Handlers) {
  EventManager.RemoveAll(result);
  for (const key in props ?? {})
    if (!props.hasOwnProperty(key) || !props[key]) continue;
    else EventManager.AddListener(result, key.replace("on_", ""), props[key]);
}

function Render(element: HTMLElement, model: ElementModel) {
  ApplyHandlers(element, model.handlers);
  ApplyProps(element, model.props);
  ReplaceHtml(element, model.children);

  return element;
}

export function ReplaceHtml(
  element: HTMLElement | DocumentFragment,
  model: NodeModel[]
) {
  if (!model) return;

  const to_add: Node[] = [];
  const replace = (n1: Node, n2: Node) => {
    if (!n1) to_add.push(n2);
    else element.replaceChild(n2, n1);
  };

  for (let i = 0; i < model.length; i++) {
    const existing = element.childNodes.item(i);
    const item = model[i];
    if (!item) continue;
    if (IsString(item)) {
      item.trim() && replace(existing, document.createTextNode(item.trim()));
      continue;
    }

    if (
      !IsHtmlElement(existing) ||
      existing.tagName !== item.tag.toUpperCase()
    ) {
      replace(existing, Render(document.createElement(item.tag), item));
      continue;
    }

    Render(existing, item);
  }

  if (model.length < element.childNodes.length)
    for (let i = model.length; i < element.childNodes.length; i++)
      element.childNodes.item(i)?.remove();

  element.append(...to_add);
}

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

export function On<K extends keyof DocumentEventMap>(
  selector: string,
  event: K,
  listener: (this: Element, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  const final = function (this: Document, e: DocumentEventMap[K]) {
    const targets = e.composedPath().filter(IsHtmlElement);
    for (const target of targets)
      if (
        Array.prototype.indexOf.call(
          (target.getRootNode() as HTMLElement).querySelectorAll(selector),
          target
        ) !== -1
      )
        listener.bind(target as Element, e)();
  };

  document.addEventListener(event, final, options);

  return {
    Off() {
      document.removeEventListener(event, final, options);
    },
  };
}
