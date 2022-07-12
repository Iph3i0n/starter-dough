let store: {
  target: Element;
  handlers: { name: string; handler: EventListenerOrEventListenerObject }[];
}[] = [];

export default {
  AddListener(
    target: Element,
    key: string,
    handler: EventListenerOrEventListenerObject
  ) {
    target.addEventListener(key, handler);
    const store_item = store.find((s) => s.target === target);
    if (!store_item) {
      store = [
        ...store,
        {
          target,
          handlers: [{ name: key, handler }],
        },
      ];
    } else {
      store_item.handlers = [...store_item.handlers, { name: key, handler }];
    }
  },
  RemoveAll(target: Element) {
    const store_item = store.find((s) => s.target === target);
    if (!store_item) return;

    for (const { name, handler } of store_item.handlers) {
      target.removeEventListener(name, handler);
    }

    store = store.filter((s) => s.target !== target);
  },
  ReplaceAllWith(
    target: Element,
    key: string,
    handler: EventListenerOrEventListenerObject
  ) {
    this.RemoveAll(target);
    this.AddListener(target, key, handler);
  },
};
