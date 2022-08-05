import { h, cloneElement, render, hydrate } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { IsHtmlElement } from "./utils/Type";

function* GetNextComponents(start: Node): Generator<any> {
  if (!IsHtmlElement(start)) return;
  const flexible = start as any;

  if (flexible.addContext) yield start;
  else for (const child of start.childNodes) yield* GetNextComponents(child);
}

export default function CustomElement(
  Component: any,
  tagName: string,
  propNames: string[],
  options: any
) {
  function PreactElement() {
    const inst = Reflect.construct(HTMLElement, [], PreactElement);
    inst._vdomComponent = Component;
    inst._root = inst.attachShadow({ mode: "open" });

    return inst;
  }
  PreactElement.prototype = Object.create(HTMLElement.prototype);
  PreactElement.prototype.constructor = PreactElement;
  PreactElement.prototype.connectedCallback = connectedCallback;
  PreactElement.prototype.attributeChangedCallback = attributeChangedCallback;
  PreactElement.prototype.disconnectedCallback = disconnectedCallback;
  PreactElement.prototype.addContext = addContext;

  PreactElement.observedAttributes = propNames;

  propNames.forEach((name) => {
    Object.defineProperty(PreactElement.prototype, name, {
      get() {
        return this._vdom.props[name];
      },
      set(v) {
        if (this._vdom) {
          this.attributeChangedCallback(name, null, v);
        } else {
          if (!this._props) this._props = {};
          this._props[name] = v;
          this.connectedCallback();
        }

        const type = typeof v;
        if (
          v == null ||
          type === "string" ||
          type === "boolean" ||
          type === "number"
        ) {
          this.setAttribute(name, v);
        }
      },
    });
  });

  return customElements.define(tagName, PreactElement as any);
}

function ContextProvider(this: any, props: any) {
  this.getChildContext = () => props.context;
  const { context, children, ...rest } = props;
  return cloneElement(children, rest);
}

function addContext(this: any, context: any) {
  this.context = { ...this.context, ...context };
  if (this.isConnected) {
    this._vdom = cloneElement(this._vdom, { context: this.context });
    render(this._vdom, this._root);
  }
}

function connectedCallback(this: any) {
  const event: any = new CustomEvent("_preact", {
    detail: {},
    bubbles: true,
    cancelable: true,
  });
  this.dispatchEvent(event);
  const context = event.detail.context;

  this.context = context;
  this._vdom = h(
    ContextProvider,
    { ...this._props, context },
    toVdom(this, this._vdomComponent)
  );
  (this.hasAttribute("hydrate") ? hydrate : render)(this._vdom, this._root);
}

function toCamelCase(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

function attributeChangedCallback(
  this: any,
  name: string,
  oldValue: any,
  newValue: any
) {
  if (!this._vdom) return;
  newValue = newValue == null ? undefined : newValue;
  const props: any = {};
  props[name] = newValue;
  props[toCamelCase(name)] = newValue;
  this._vdom = cloneElement(this._vdom, props);
  render(this._vdom, this._root);
}

function disconnectedCallback(this: any) {
  render((this._vdom = null), this._root);
}

function Slot(this: any, props: any, context: any) {
  const ref = useRef<HTMLSlotElement>();

  useEffect(() => {
    const slot = ref.current;
    if (!slot) return;
    const listener = (event: any) => {
      event.stopPropagation();
      event.detail.context = context;
    };

    slot.addEventListener("_preact", listener);
    return () => slot.removeEventListener("_preact", this._listener);
  }, [ref.current]);

  useEffect(() => {
    const slot = ref.current;
    if (!slot) return;

    const targets = [];
    for (const node of slot.assignedNodes())
      targets.push(...GetNextComponents(node));

    for (const target of targets) target.addContext(context);
  }, [context, ref.current]);

  return h("slot", { ...props, ref });
}

function toVdom(element: any, nodeName: any): any {
  if (element.nodeType === 3) return element.data;
  if (element.nodeType !== 1) return null;
  let children = [],
    props = {} as any,
    i = 0,
    a = element.attributes,
    cn = element.childNodes;
  for (i = a.length; i--; ) {
    if (a[i].name !== "slot") {
      props[a[i].name] = a[i].value;
      props[toCamelCase(a[i].name)] = a[i].value;
    }
  }

  for (i = cn.length; i--; ) {
    const vnode = toVdom(cn[i], null);
    const name = cn[i].slot;
    if (name) {
      props[name] = h(Slot, { name }, vnode);
    } else {
      children[i] = vnode;
    }
  }

  const wrappedChildren = nodeName ? h(Slot, null, children) : children;
  return h(nodeName || element.nodeName.toLowerCase(), props, wrappedChildren);
}
