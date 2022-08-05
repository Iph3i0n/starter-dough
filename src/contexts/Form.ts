import { createContext } from "preact";

export default createContext({
  get: (key: string) => "" as string,
  set: (key: string, value: string) => {},
  submit: () => {},
});
