import Colour, { IsColour } from "./utils/Colour";
import Object from "./utils/Object";

export const PreferDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
export const PreferNoMotion = window.matchMedia(
  "(prefers-reduced-motion)"
).matches;

const DefaultTheme = {
  padding: {
    text_sm: "0.5rem",
    text_lg: "1rem",
    block: "1rem",
    badge: "0.2rem",
  },
  border: {
    radius: "0.5rem",
    radius_sm: "0.25rem",
    width: "2px",
    standard_borders: "1px solid #555",
    standard_box_shadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  text: {
    font_family: '"Poppins", sans-serif',
    line_height: "1.2",
    size: {
      display_h1: "5rem",
      display_h2: "4.5rem",
      display_h3: "4rem",
      display_h4: "3.5rem",
      display_h5: "3rem",
      display_h6: "2.5rem",
      h1: "3rem",
      h2: "2.5rem",
      h3: "2rem",
      h4: "1.75rem",
      h5: "1.5rem",
      h6: "1.25rem",
      body: "1rem",
      body_large: "1.1rem",
      small: "0.75rem",
    },
    weight: {
      heading: "700",
      display: "300",
      body: "500",
    },
  },
  colour_store: {
    red: new Colour("#f94144"),
    "dark-orange": new Colour("#f3722c"),
    orange: new Colour("#f8961e"),
    "light-orange": new Colour("#f9844a"),
    yellow: new Colour("#f9c74f"),
    green: new Colour("#90be6d"),
    teal: new Colour("#43aa8b"),
    "dark-teal": new Colour("#4d908e"),
    "dark-blue": new Colour("#577590"),
    blue: new Colour("#277da1"),
    dark: new Colour(PreferDark ? "#f7f7f7" : "#222"),
    light: new Colour("#fff"),
    shadow: PreferDark
      ? new Colour([174, 174, 174, 0.2])
      : new Colour([34, 34, 34, 0.2]),
    faded: new Colour("#666"),
    background: new Colour(PreferDark ? "#242424" : "#fff"),
    surface: new Colour(PreferDark ? "#2e2d2d" : "#f7f7f7"),
  },
  colours: {
    body_dark: "dark" as const,
    body_white: "light" as const,
    body_fade: "faded" as const,
    bg_white: "background" as const,
    bg_surface: "surface" as const,
    bg_dark: "faded" as const,
    anchor: "blue" as const,
    box_shadow: "shadow" as const,
  },
  screen: {
    xs: { breakpoint: "0px", width: "320px" },
    sm: { breakpoint: "500px", width: "410px" },
    md: { breakpoint: "750px", width: "700px" },
    lg: { breakpoint: "1200px", width: "1150px" },
    xl: { breakpoint: "1440px", width: "1400px" },
  },
  animation: {
    time_fast: PreferNoMotion ? "0ms" : "100ms",
    time_slow: PreferNoMotion ? "0ms" : "500ms",
  },
};

export const CT = Object.DeepMerge(DefaultTheme, (window as any).Theme ?? {});

export const Columns = 12;

export const Colours = Object.Keys(CT.colour_store).length;

type ColourName = keyof typeof CT["colour_store"];

export const ColourNames = Object.Keys(CT.colour_store);

export const Sizes = Object.Keys(CT.screen);

export type Size = typeof Sizes[number];

export function GetColour(name: ColourName): Colour {
  return CT.colour_store[name];
}

export function FromText(item: Colour) {
  const target = CT.colour_store[item.Text];
  if (!IsColour(target)) return "";
  return target.Hex;
}
