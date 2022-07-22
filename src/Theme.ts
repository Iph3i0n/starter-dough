import Border from "./styles/Border";
import BoxShadow from "./styles/BoxShadow";
import Colour from "./styles/Colour";
import Font from "./styles/Font";
import Object from "./utils/Object";
import Padding from "./styles/Padding";

export const PreferDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
export const PreferNoMotion = window.matchMedia(
  "(prefers-reduced-motion)"
).matches;

const DefaultTheme = {
  padding: {
    block: new Padding("padding", "1rem"),
    badge: new Padding("padding", "0.2rem"),
    input: new Padding("padding", "0.5rem", "0.75rem"),
  },
  border: {
    standard: new Border({
      width: "1px",
      style: "solid",
      colour: new Colour("#666"),
      radius: "0.5rem",
    }),
    small: new Border({
      width: "1px",
      style: "solid",
      colour: new Colour("#666"),
      radius: "0.25rem",
    }),
    check: new Border({
      width: "2px",
      style: "solid",
      colour: new Colour("#222"),
      radius: "1rem",
    }),
  },
  box_shadow: {
    large: new BoxShadow({
      blur: "10px",
      colour: new Colour(PreferDark ? [100, 100, 100, 0.1] : [0, 0, 0, 0.1]),
    }),
    small: new BoxShadow({
      blur: "4px",
      colour: new Colour(PreferDark ? [100, 100, 100, 0.5] : [0, 0, 0, 0.5]),
    }),
  },
  text: {
    display_h1: new Font({
      weight: "300",
      size: "5rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h1",
    }),
    display_h2: new Font({
      weight: "300",
      size: "4.5rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h2",
    }),
    display_h3: new Font({
      weight: "300",
      size: "4rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h3",
    }),
    display_h4: new Font({
      weight: "300",
      size: "3.5rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h4",
    }),
    display_h5: new Font({
      weight: "300",
      size: "3rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h5",
    }),
    display_h6: new Font({
      weight: "300",
      size: "4.5rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h6",
    }),
    h1: new Font({
      weight: "700",
      size: "3rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h1",
    }),
    h2: new Font({
      weight: "700",
      size: "2.5rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h2",
    }),
    h3: new Font({
      weight: "700",
      size: "2rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h3",
    }),
    h4: new Font({
      weight: "700",
      size: "1.75rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h4",
    }),
    h5: new Font({
      weight: "700",
      size: "1.5rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h5",
    }),
    h6: new Font({
      weight: "700",
      size: "1.25rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "1rem", "0"),
      tag: "h6",
    }),
    body: new Font({
      weight: "500",
      size: "1rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "0.5rem", "0"),
      tag: "p",
    }),
    body_large: new Font({
      weight: "500",
      size: "1.1rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "0.5rem", "0"),
      tag: "p",
    }),
    small: new Font({
      weight: "500",
      size: "0.75rem",
      family: '"Poppins", sans-serif',
      padding: new Padding("margin", "0.5rem", "0"),
      tag: "small",
    }),
  },
  colours: {
    body: new Colour(PreferDark ? "#242424" : "#fff"),
    surface: new Colour(PreferDark ? "#2e2d2d" : "#f7f7f7"),
    contrast: new Colour("#666"),
    anchor: new Colour([0, 0, 0, 0], "#277da1"),
    faded_text: new Colour([0, 0, 0, 0], "#666"),
    red: new Colour("#f33"),
    green: new Colour("#3f3"),
  },
  screen: {
    xs: { breakpoint: "0px", width: "320px" },
    sm: { breakpoint: "500px", width: "410px" },
    md: { breakpoint: "750px", width: "700px" },
    lg: { breakpoint: "1200px", width: "1150px" },
    xl: { breakpoint: "1440px", width: "1400px" },
  },
  animation: {
    fast: PreferNoMotion ? "0ms" : "100ms",
    slow: PreferNoMotion ? "0ms" : "500ms",
  },
};

export const CT = Object.DeepMerge(DefaultTheme, (window as any).Theme ?? {});

export const Columns = 12;

export const Colours = Object.Keys(CT.colours).length;

type ColourName = keyof typeof CT["colours"];

export const ColourNames = Object.Keys(CT.colours);

export const Sizes = Object.Keys(CT.screen);

export type Size = typeof Sizes[number];

export type Speed = keyof typeof CT["animation"];

export const TextVariants = Object.Keys(CT.text);

export function GetColour(name: ColourName): Colour {
  return CT.colours[name];
}
