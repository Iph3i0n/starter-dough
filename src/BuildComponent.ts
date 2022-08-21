import { Checker, IsObject, IsType } from "@paulpopat/safe-type";
import { h, JSX, render } from "preact";
import { useState } from "preact/hooks";
import Object from "./utils/Object";
import { IsHtmlElement } from "./utils/Type";

export type IsProps = Record<string, Checker<any>>;

export type FromProps<TProps extends IsProps> = {
  [TKey in keyof TProps]: IsType<TProps[TKey]>;
};

export type Child<
  TProps extends IsProps,
  TParent extends PreactComponent<any, any>
> = {
  is_props: TProps;
  handler: (
    this: PreactComponent<TProps, any>,
    props: FromProps<TProps>,
    parent: TParent
  ) => JSX.Element;
  parent: TParent;
};

function ProcessProps(props: any) {
  return Object.MapKeys(props, (_, value) =>
    value === "" ? true : value === "true" ? true : value
  );
}

type StateListner<TState> = (state: TState) => void;

export default abstract class PreactComponent<
  TProps extends IsProps = {},
  TState = any
> extends HTMLElement {
  private props_handler = (props: FromProps<TProps>) => {};
  private state_handler = (state: TState) => {};
  private listeners = [] as StateListner<TState>[];
  private state: TState;
  private readonly child_components: Record<string, Child<any, any>> = {};
  protected readonly root: ShadowRoot;

  protected get Props() {
    let props: any = {};
    for (const attribute of this.attributes) {
      props[attribute.name] = attribute.value;
    }

    props = ProcessProps(props);
    if (!IsObject(this.IsProps)(props, false))
      throw new Error(
        "Invalid props for " + this.tagName + " see received above"
      );

    return props as FromProps<TProps>;
  }

  private get IsPreact() {
    return true;
  }

  private static IsPreact(target: any): target is PreactComponent<any> {
    if (!IsHtmlElement(target)) return false;

    if (!(target as PreactComponent<any>).IsPreact) return false;
    return true;
  }

  public constructor(default_state?: TState) {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.state = default_state as TState;
  }

  public SetChild<TProps extends IsProps>(
    is_props: Child<TProps, typeof this>["is_props"],
    handler: Child<TProps, typeof this>["handler"],
    slot?: string
  ) {
    this.child_components[slot ?? "DEFAULT_SLOT"] = {
      is_props,
      handler: handler,
      parent: this,
    };
  }

  protected get PreactParent() {
    return new Promise<PreactComponent<any>>((res) => {
      const interval = setInterval(() => {
        if (PreactComponent.IsPreact(this.parentElement)) {
          res(this.parentElement);
          clearInterval(interval);
        }
      }, 20);
    });
  }

  public async PreactParentOfType<
    T extends new () => PreactComponent<any, any>
  >(checker: T): Promise<InstanceType<T>> {
    const parent = await this.PreactParent;
    if (!(parent instanceof checker))
      throw new Error("Incorrect parent for " + this.tagName);

    return parent as InstanceType<T>;
  }

  public get ChildType() {
    return new Promise<Child<any, PreactComponent<any, any>>>((res) => {
      this.PreactParent.then((t) => {
        const interval = setInterval(() => {
          if (t.GetChild()) {
            res(t.GetChild());
            clearInterval(interval);
          }
        }, 20);
      });
    });
  }

  public get IndexOfParent() {
    const siblings = this.parentElement?.children;
    if (!siblings) return -1;

    for (let i = 0; i < siblings.length; i++)
      if (siblings[i] === this) return i;

    return -1;
  }

  public get LastChild() {
    const siblings = this.parentElement?.children;
    if (!siblings) return -1;

    return this.IndexOfParent === siblings.length - 1;
  }

  public set State(value: TState) {
    this.state = value;
    this.state_handler(value);
    for (const listener of this.listeners) listener(value);
  }

  public GetChild(slot?: string) {
    return this.child_components[slot ?? "DEFAULT_SLOT"];
  }

  public get State() {
    return this.state;
  }

  public set OnState(listener: StateListner<TState>) {
    this.listeners = [...this.listeners, listener];
  }

  public set OffState(listener: StateListner<TState>) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  protected abstract Render(
    props: FromProps<TProps>,
    state: TState
  ): JSX.Element;
  protected abstract readonly IsProps: IsProps;

  public connectedCallback() {
    const Component = () => {
      const [props, set_props] = useState(this.Props);
      const [state, set_state] = useState(this.state);

      this.props_handler = set_props;
      this.state_handler = set_state;
      return this.Render(props, state as any);
    };

    render(h(Component, {}), this.root);
  }

  public disconnectedCallback() {
    render(null, this.root);
  }

  public attributeChangedCallback() {
    if (!this.isConnected) return;
    this.props_handler(this.Props);
  }

  public static get IncludedTags() {
    return [] as string[];
  }
}
