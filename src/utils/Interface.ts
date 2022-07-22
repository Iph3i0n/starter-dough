export function AddToGlobalScope<T>(name: string, item: T) {
  (window as any)[name] = item;
}
