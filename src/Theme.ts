import Border from "./styles/Border";
import BoxShadow from "./styles/BoxShadow";
import Colour from "./styles/Colour";
import Font from "./styles/Font";
import Object from "./utils/Object";
import Padding from "./styles/Padding";
import { AddToGlobalScope } from "./utils/Interface";

export const PreferDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
export const PreferNoMotion = window.matchMedia(
  "(prefers-reduced-motion)"
).matches;

AddToGlobalScope("PreferDark", PreferDark);
AddToGlobalScope("PreferNoMotion", PreferNoMotion);

const DefaultTheme = {
  padding: {
    block: new Padding("padding", "1rem"),
    small_block: new Padding("padding", "0.5rem"),
    badge: new Padding("padding", "0.2rem"),
    input: new Padding("padding", "0.5rem", "0.75rem"),
  },
  border: {
    standard: new Border({
      radius: "0.25rem",
    }),
    small: new Border({
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
    code: new Font({
      weight: "500",
      size: "1rem",
      family: "'Fira Code', monospace",
      padding: new Padding("margin", "1rem", "0"),
      tag: "code",
    }),
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
    body: new Colour(PreferDark ? "#222" : "#f7f3f1"),
    surface: new Colour(PreferDark ? "#333" : "#fff"),
    contrast: new Colour(PreferDark ? "#000" : "#322"),

    faded_text: new Colour([0, 0, 0, 0], "#999"),

    primary: new Colour("#9889bb").GreyscaleTransform(PreferDark ? 80 : 50),
    info: new Colour("#0087cb"),
    success: new Colour("#3fc9a2").GreyscaleTransform(80),
    warning: new Colour("#ff9600"),
    danger: new Colour("#f3000c"),
  },
  screen: {
    xs: { breakpoint: "0px", width: "320px" },
    sm: { breakpoint: "500px", width: "410px" },
    md: { breakpoint: "750px", width: "700px" },
    lg: { breakpoint: "1200px", width: "1150px" },
    xl: { breakpoint: "1440px", width: "1250px" },
  },
  animation: {
    fast: PreferNoMotion ? "0ms" : "100ms",
    slow: PreferNoMotion ? "0ms" : "500ms",
  },
  animation_curve: "linear",
  font_urls: [
    "https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;500&family=Raleway:wght@300;500;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap",
  ],
};

export const CT = Object.DeepMerge(
  DefaultTheme,
  (window as any).Theme?.bind()() ?? {}
);

export const Columns = 12;

export const Colours = Object.Keys(CT.colours).length;

export type ColourName = keyof typeof CT["colours"];

export const ColourNames = Object.Keys(CT.colours);

export const Sizes = Object.Keys(CT.screen);

export type Size = typeof Sizes[number];

export type Speed = keyof typeof CT["animation"];

export const TextVariants = Object.Keys(CT.text);

export type TextVariant = typeof TextVariants[number];

export function GetColour(name: ColourName): Colour {
  return CT.colours[name];
}
