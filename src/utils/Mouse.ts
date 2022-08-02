const state = { x: 0, y: 0 };

window.onmousemove = (event) => {
  const body = document.body;
  state.x = event.clientX + body.scrollLeft - body.clientLeft;
  state.y = event.clientY + body.scrollTop - body.clientTop;
};

export function GetMousePosition() {
  return [state.x, state.y] as const;
}

export type Position = ReturnType<typeof GetMousePosition>;
