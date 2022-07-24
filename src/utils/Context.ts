import { v4 as Guid } from "uuid";

export default function CreateContext<T>(default_value: T) {
  const id = Guid();
  let listeners: (() => void)[] = [];

  return {
    Attach(target: HTMLElement, value: T) {
      const subject: any = target;
      const store = subject.P_BLOCKS_CONTEXTS ?? {};
      subject.P_BLOCKS_CONTEXTS = { ...store, [id]: value };
      
      for (const listener of listeners) listener();
    },
    Retrieve(target: HTMLElement): T {
      const internal = (target: any): T => {
        if (typeof target.P_BLOCKS_CONTEXTS === "object" && id in target.P_BLOCKS_CONTEXTS) 
          return target.P_BLOCKS_CONTEXTS[id];
        

        if (target.parentElement) return internal(target.parentElement);

        return default_value;
      }

      if (target.parentElement) return internal(target.parentElement);
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