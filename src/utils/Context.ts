import { v4 as Guid } from "uuid";

export default function CreateContext<T>(default_value: T) {
  const id = "context" + Guid().replace(/-/gm, '');

  const store = {} as Record<string, T>;
  let listeners: (() => void)[] = [];

  return {
    Attach(target: HTMLElement, value: T) {
      const current = target.dataset[id]
      if (current) delete store[current];

      const instance = Guid();
      target.dataset[id] = instance;
      store[instance] = value;
      for (const listener of listeners) listener();
    },
    Retrieve(target: HTMLElement): T {
      const current = target.dataset[id];
      if (current) return store[current];
      if (target.parentElement) return this.Retrieve(target.parentElement);
      return default_value;
    },
    AddOnChange(handler: () => void) {
      listeners = [...listeners, handler];
    },
    RemoveOnChange(handler: () => void) {
      listeners = listeners.filter(l => l !== handler);
    }
  };
}

export type Context<T> = ReturnType<typeof CreateContext<T>>