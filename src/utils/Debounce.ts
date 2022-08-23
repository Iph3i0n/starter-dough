export default function Debounce<T extends (...args: any[]) => void>(
  handler: T,
  timer?: number
) {
  let timeout: any;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => handler(...args), timer ?? 20);
  };
}
