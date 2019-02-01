import Theme, { Colors } from "../../types/theme";

import { darken, lighten, transparentize } from "polished";
import R from "ramda";

const baseAlpha = 0.5;
const baseDarken = 0.1;
const baseLighten = 0.1;

const darkVariant = (name, color) => ({
  [`dark${name}`]: darken(baseDarken, color),
  [`alphadark${name}`]: transparentize(baseAlpha, darken(baseDarken, color)),
});
const lightVariant = (name, color) => ({
  [`light${name}`]: lighten(baseLighten, color),
  [`alphalight${name}`]: transparentize(baseAlpha, lighten(baseLighten, color)),
});
const color = (color, variants = []) => ({ color, variants });

const baseColors = {
  black: color("#000"),
  white: color("#fff"),
  darker: color("#2b2b2b"),
  darken: color("rgba(0, 0, 0, 0.25)"),
  grayer: color(darken(0.1, "#bbb")),
  gray: color("#bbb"),
  light: color("#eee"),

  blue: color("#03a9f3", [darkVariant, lightVariant]),
  indigo: color("#6610f2", [darkVariant, lightVariant]),
  violet: color("#ab8ce4", [darkVariant, lightVariant]),
  fuchsia: color("#ee00de", [darkVariant, lightVariant]),
  pink: color("#e83e8c", [darkVariant, lightVariant]),
  red: color("#ff0000", [darkVariant, lightVariant]),
  orange: color("#fb9678", [darkVariant, lightVariant]),
  yellow: color("#fec107", [darkVariant, lightVariant]),
  lime: color("#67ee00", [darkVariant, lightVariant]),
  green: color("#00c292", [darkVariant, lightVariant]),
  teal: color("#20c997", [darkVariant, lightVariant]),
  cyan: color("#01c0c8", [darkVariant, lightVariant]),
};

const colors = R.pipe(
  R.toPairs,
  R.reduce((a, [key, value]) => {
    a[key] = value.color;
    a[`alpha${key}`] = transparentize(baseAlpha, value.color);

    const result = value.variants.reduce(
      (res, b) => ({ ...res, ...b(key, value.color) }),
      a,
    );

    return result;
  }, {}),
)(baseColors) as Colors;

export const breakpoints = [32, 48, 64, 80].map((n) => `${n}rem`);

export const sizes = [0, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4];

export const space = [0, 0.25, 0.5, 1, 2, 4, 8];

export const fontSizes = [0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4];

export const squarePaddings = [
  { x: .125, y: .125 },
  { x: .25, y: .25 },
  { x: .375, y: .375 },
  { x: .5, y: .5 },
  { x: .75, y: .75 },
  { x: 1, y: 1 },
  { x: 1.25, y: 1.25 },
  { x: 1.50, y: 1.50 },
  { x: 1.75, y: 1.75 },
];

export const rectangularPaddings = [
  { x: .0625, y: .125 },
  { x: .5, y: .25 },
  { x: .75, y: .375 },
  { x: 1, y: .5 },
  { x: 1.5, y: .75 },
  { x: 2, y: 1 },
  { x: 2.5, y: 1.25 },
  { x: 3, y: 1.50 },
  { x: 3.5, y: 1.75 },
];

export const fontWeights = {
  normal: 400,
  bold: 700,
};

export const radii = [0, .15, .3];

export const fonts = {
  0: `'Open Sans', sans-serif`,
  sans: `'Open Sans', sans-serif`,
  mono: "\"SF Mono\", \"Roboto Mono\", Menlo, monospace",
};

export const shadows = [
  "none",
  `inset 0 0 0 1px ${colors.gray}`,
  `inset 0 0 0 1px ${colors.gray}, 0 0 4px ${colors.gray}`,
];

export const defaults = {
  bg: {
    primary: colors.green,
    secondary: colors.violet,
    success: colors.lime,
    danger: colors.red,
    warning: colors.orange,
    info: colors.cyan,
    light: colors.white,
    dark: colors.black,
    muted: colors.darker,
    white: colors.white,
  },
  fg: {
    primary: colors.white,
    secondary: colors.white,
    success: colors.white,
    danger: colors.white,
    warning: colors.white,
    info: colors.white,
    light: colors.black,
    dark: colors.white,
    muted: colors.black,
    white: colors.black,
  },
};

export default {
  defaults,
  breakpoints,
  space,
  fontSizes,
  fontWeights,
  fonts,
  colors,
  radii,
  shadows,
  rectangularPaddings,
  squarePaddings,
  sizes,
} as Theme;
