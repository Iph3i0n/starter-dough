import { Checker, IsObject } from "@paulpopat/safe-type";
import Css from "./CSS";
import { Context } from "./utils/Context";
import { NodeModel, ReplaceHtml } from "./utils/Html";
import Object from "./utils/Object";

type Props = Record<string, string | boolean | null | undefined>;
type PropsChecker<TProps extends Props> = {
  [TKey in keyof TProps]: Checker<TProps[TKey]>;
};

type ComponentEvent = "render" | "load" | "unload" | "moved" | "children";

function Register(tag: string, extension?: string) {
  return (target: new (...params: any[]) => HTMLElement) => {
    customElements.define(tag, target, { extends: extension });
  };
}

type Handlers = Partial<Record<ComponentEvent, () => void>>;

abstract class Component<TProps extends Props, TState> extends HTMLElement {
  protected abstract state: TState;
  protected abstract readonly is_props: Checker<TProps>;
  protected abstract readonly additional_css: string;
  protected abstract render(): NodeModel[];
  protected abstract css(): Css | undefined;

  private handlers: Handlers = {};
  private initialised = false;
  private cleanup_context = () => {};
  private styles: HTMLStyleElement = document.createElement("style");
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  public get State() {
    return Object.AsReadonly(this.state);
  }

  public set State(state: TState) {
    this.state = state;
    this.PerformRender();
  }

  public get Props() {
    return Object.AsReadonly(this.Attributes);
  }

  public get Root() {
    return this.shadow;
  }

  public get Children() {
    return this.childNodes;
  }

  public get ChildElements() {
    return this.children;
  }

  public On(event: ComponentEvent, handler: () => void) {
    this.handlers[event] = handler;
  }

  public Provide<T>(context: Context<T>, value: T) {
    context.Attach(this, value);
  }

  public Use<T>(context: Context<T>) {
    const handler = () => this.PerformRender();
    context.AddOnChange(handler);
    const old_cleanup = this.cleanup_context;
    this.cleanup_context = () => {
      context.RemoveOnChange(handler);
      old_cleanup();
    };
    return context.Retrieve(this);
  }

  private get Attributes() {
    const attributes = {} as any;
    for (const attribute of this.attributes) {
      if (attribute.value === "") attributes[attribute.name] = true;
      else attributes[attribute.name] = attribute.value;
    }

    if (!this.is_props(attributes, false)) throw new Error("Invalid props");

    return attributes;
  }

  private set Styles(styles: Css | undefined) {
    this.styles.textContent = styles?.toString() + (this.additional_css ?? "");
    this.shadow.append(this.styles);
  }

  private set Html(nodes: NodeModel[]) {
    ReplaceHtml(this.shadow, nodes);
  }

  private Trigger(event: ComponentEvent) {
    const handler = this.handlers[event];
    handler && handler();
  }

  private PerformRender() {
    try {
      this.cleanup_context();
      this.cleanup_context = () => {};
      this.Html = this.render();
      this.Styles = this.css();

      this.Trigger("render");

      this.shadow.querySelectorAll("slot").forEach((slot) => {
        slot.addEventListener("slotchange", () => this.Trigger("children"));
      });
    } catch (err) {
      console.error("Error rendering " + this.tagName);
      throw err;
    }
  }

  public connectedCallback() {
    this.PerformRender();
    this.Trigger("load");
    this.initialised = true;
  }

  public disconnectedCallback() {
    this.Trigger("unload");
    this.cleanup_context();
  }

  public adoptedCallback() {
    this.Trigger("moved");
  }

  public attributeChangedCallback() {
    if (!this.initialised) return;

    this.PerformRender();
  }
}

type ComponentSpec<TProps extends Props, TState> = {
  render: (this: Component<TProps, TState>) => NodeModel[];
  css?: (this: Component<TProps, TState>) => Css;
  additional_css?: string;
};

export default function Define<TProps extends Props, TState extends object>(
  tag: string,
  props: PropsChecker<TProps>,
  state: TState,
  spec: ComponentSpec<TProps, TState>
) {
  Register(tag)(
    class extends Component<TProps, TState> {
      protected override state = state;
      protected override is_props = IsObject(props);
      protected override additional_css = spec.additional_css ?? "";
      protected override render(): NodeModel[] {
        return spec.render.bind(this)();
      }

      protected override css(): Css | undefined {
        return spec.css?.bind(this)();
      }

      constructor() {
        super();
      }

      static get observedAttributes() {
        return Object.Keys(props);
      }
    }
  );
}
