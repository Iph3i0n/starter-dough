import {
  Assert,
  IsArray,
  IsObject,
  IsString,
  IsType,
} from "@paulpopat/safe-type";
import Colour, { IsColour } from "./utils/Colour";
import Object from "./utils/Object";

export const PreferDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
export const PreferNoMotion = window.matchMedia(
  "(prefers-reduced-motion)"
).matches;

export const IsTheme = IsObject({
  padding: IsObject({
    text_sm: IsString,
    text_lg: IsString,
    block: IsString,
  }),
  border: IsObject({
    radius: IsString,
    width: IsString,
  }),
  text: IsObject({
    font_family: IsString,
    line_height: IsString,
    size: IsObject({
      h1: IsString,
      h2: IsString,
      h3: IsString,
      h4: IsString,
      h5: IsString,
      h6: IsString,
      display_h1: IsString,
      display_h2: IsString,
      display_h3: IsString,
      display_h4: IsString,
      display_h5: IsString,
      display_h6: IsString,
      body: IsString,
      body_large: IsString,
      small: IsString,
    }),
    weight: IsObject({
      heading: IsString,
      display: IsString,
      body: IsString,
    }),
  }),
  colours: IsObject({
    body_dark: IsColour,
    body_white: IsColour,
    body_fade: IsColour,
    bg_white: IsColour,
    bg_surface: IsColour,
    bg_dark: IsColour,
    rainbow: IsArray(IsObject({ name: IsString, value: IsColour })),
    box_shadow: IsColour,
  }),
  screen: IsObject({
    xs: IsObject({ breakpoint: IsString, width: IsString }),
    sm: IsObject({ breakpoint: IsString, width: IsString }),
    md: IsObject({ breakpoint: IsString, width: IsString }),
    lg: IsObject({ breakpoint: IsString, width: IsString }),
    xl: IsObject({ breakpoint: IsString, width: IsString }),
  }),
  animation: IsObject({
    time_fast: IsString,
  }),
});

export type Theme = IsType<typeof IsTheme>;

export const CT = ((): Theme => {
  try {
    const theme = (window as any).Theme;
    Assert(IsTheme, theme);
    return theme;
  } catch {
    return {
      padding: {
        text_sm: "0.5rem",
        text_lg: "1rem",
        block: "1rem",
      },
      border: {
        radius: "0.5rem",
        width: "2px",
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
      colours: {
        body_dark: new Colour(PreferDark ? "#f7f7f7" : "#222"),
        body_white: new Colour("#fff"),
        body_fade: new Colour("#666"),
        bg_white: new Colour(PreferDark ? "#242424" : "#fff"),
        bg_surface: new Colour(PreferDark ? "#2e2d2d" : "#f7f7f7"),
        bg_dark: new Colour("#666"),
        rainbow: [
          { name: "red", value: new Colour("#f94144") },
          { name: "dark-orange", value: new Colour("#f3722c") },
          { name: "orange", value: new Colour("#f8961e") },
          { name: "light-orange", value: new Colour("#f9844a") },
          { name: "yellow", value: new Colour("#f9c74f") },
          { name: "green", value: new Colour("#90be6d") },
          { name: "teal", value: new Colour("#43aa8b") },
          { name: "dark-teal", value: new Colour("#4d908e") },
          { name: "dark-blue", value: new Colour("#577590") },
          { name: "blue", value: new Colour("#277da1") },
          { name: "dark", value: new Colour(PreferDark ? "#f7f7f7" : "#222") },
          { name: "light", value: new Colour("#fff") },
        ],
        box_shadow: PreferDark
          ? new Colour([174, 174, 174, 0.2])
          : new Colour([34, 34, 34, 0.2]),
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
      },
    };
  }
})();

export const Columns = 12;

export const Colours = CT.colours.rainbow.length;

export const ColourNames = CT.colours.rainbow.map((r) => r.name);

export const Sizes = Object.Keys(CT.screen);

export type Size = typeof Sizes[number];

export function GetColour(name: string) {
  return CT.colours.rainbow.find((c) => c.name === name)?.value;
}

export function FromText(key: keyof Theme["colours"] | undefined) {
  if (!key) return "";
  const target = CT.colours[key];
  if (!IsColour(target)) return "";
  return target.Hex;
}
