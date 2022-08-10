import { useEffect, useRef, useState } from "preact/hooks";

export function UseSlotRef(
  handler: (slot: HTMLSlotElement) => void | (() => void)
) {
  const ref = useRef<HTMLSlotElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    return handler(target);
  }, [ref.current]);

  return ref;
}

export function UseChildElements() {
  const [children, set_children] = useState([] as Element[]);
  const ref = UseSlotRef((slot) => {
    const handler = () => set_children(slot.assignedElements());
    slot.addEventListener("slotchange", handler);
    handler();
    return () => slot.removeEventListener("slotchange", handler);
  });

  return [ref, children] as const;
}
