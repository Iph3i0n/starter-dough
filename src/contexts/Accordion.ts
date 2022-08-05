import { createContext } from "preact";

export default createContext({
  click: (id: string) => {},
  current: "",
});
