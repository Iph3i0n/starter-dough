import { Checker, IsObject } from "@paulpopat/safe-type";
import Css from "./CSS";
import RenderCSS from "./CSS";
import { Context } from "./utils/Context";
import { NodeModel, ReplaceHtml } from "./utils/Html";
import Object from "./utils/Object";

type Props = Record<string, string | boolean | null | undefined>;
type PropsChecker<TProps extends Props> = {
  [TKey in keyof TProps]: Checker<TProps[TKey]>;
};

type ComponentEvent = "render" | "load" | "unload" | "moved" | "children";

type EventHandler<TProps extends Props, TState> = (
  this: ComponentContext<TProps, TState>
) => void;

type ComponentContext<TProps extends Props, TState> = {
  readonly root: DocumentFragment;
  readonly children: Node[];
  readonly child_elements: Element[];
  readonly state: Readonly<TState>;
  set_state(new_state: TState): void;
  readonly props: Readonly<TProps>;
  readonly ele: HTMLElement;
  listen(event: ComponentEvent, handler: EventHandler<TProps, TState>): void;
  provide_context<T>(context: Context<T>, value: T): void;
  use_context<T>(context: Context<T>): T;
};

type ComponentSpec<TProps extends Props, TState> = {
  render: (this: ComponentContext<TProps, TState>) => NodeModel[];
  css?: (this: ComponentContext<TProps, TState>) => Css;
  additional_css?: string;
};

function Register(tag: string, extension?: string) {
  return (target: new (...params: any[]) => HTMLElement) => {
    customElements.define(tag, target, { extends: extension });
  };
}

export default function Define<TProps extends Props, TState extends object>(
  tag: string,
  props: PropsChecker<TProps>,
  state: TState,
  spec: ComponentSpec<TProps, TState>
) {
  type Handlers = Partial<Record<ComponentEvent, EventHandler<TProps, TState>>>;
  Register(tag)(
    class extends HTMLElement {
      private state = state;
      private handlers: Handlers = {};
      private initialised = false;
      private cleanup_context = () => {};
      private styles: HTMLStyleElement = document.createElement("style");
      private shadow: ShadowRoot;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      private get Attributes() {
        const attributes = {} as any;
        for (const attribute of this.attributes) {
          if (attribute.value === "") attributes[attribute.name] = true;
          else attributes[attribute.name] = attribute.value;
        }

        if (!IsObject(props)(attributes, false))
          throw new Error("Invalid props");

        return attributes;
      }

      private set Styles(styles: Css | undefined) {
        this.styles.textContent =
          styles?.toString() + (spec.additional_css ?? "");
        this.shadow.append(this.styles);
      }

      private set Html(nodes: NodeModel[]) {
        ReplaceHtml(this.shadow, nodes);
      }

      private get Context(): ComponentContext<TProps, TState> {
        const _this = this;
        return {
          get props() {
            return Object.AsReadonly(_this.Attributes);
          },
          get root() {
            return _this.shadow;
          },
          get state() {
            return Object.AsReadonly(_this.state);
          },
          set_state: (new_state) => {
            this.state = new_state;
            this.PerformRender();
          },
          get children() {
            return _this.shadow.querySelector("slot")?.assignedNodes() ?? [];
          },
          get child_elements() {
            return _this.shadow.querySelector("slot")?.assignedElements() ?? [];
          },
          get ele() {
            return _this;
          },
          listen: (event, handler) => {
            this.handlers[event] = handler;
          },
          provide_context: (context, value) => {
            context.Attach(this, value);
          },
          use_context: (context) => {
            const handler = () => this.PerformRender();
            context.AddOnChange(handler);
            const old_cleanup = this.cleanup_context;
            this.cleanup_context = () => {
              context.RemoveOnChange(handler);
              old_cleanup();
            };
            return context.Retrieve(this);
          },
        };
      }

      private Trigger(event: ComponentEvent) {
        this.handlers[event]?.bind(this.Context)();
      }

      private PerformRender() {
        try {
          this.cleanup_context();
          this.cleanup_context = () => {};
          this.Html = spec.render.bind(this.Context)();
          this.Styles = spec.css?.bind(this.Context)();

          this.Trigger("render");

          this.shadow.querySelectorAll("slot").forEach((slot) => {
            slot.addEventListener("slotchange", () => this.Trigger("children"));
          });
        } catch (err) {
          console.error("Error rendering " + tag);
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

      static get observedAttributes() {
        return Object.Keys(props);
      }
    }
  );
}
