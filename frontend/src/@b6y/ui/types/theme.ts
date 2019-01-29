interface Colors {
  black: string;
  alphablack: string;
  white: string;
  alphawhite: string;
  darker: string;
  alphadarker: string;
  darken: string;
  alphadarken: string;
  grayer: string;
  alphagrayer: string;
  gray: string;
  alphagray: string;
  light: string;
  alphalight: string;

  blue: string;
  alphablue: string;
  darkblue: string;
  lightblue: string;
  alphalightblue: string;
  alphadarkblue: string;

  indigo: string;
  alphaindigo: string;
  darkindigo: string;
  lightindigo: string;
  alphalightindigo: string;
  alphadarkindigo: string;

  violet: string;
  alphaviolet: string;
  darkviolet: string;
  lightviolet: string;
  alphalightviolet: string;
  alphadarkviolet: string;

  fuchsia: string;
  alphafuchsia: string;
  darkfuchsia: string;
  lightfuchsia: string;
  alphalightfuchsia: string;
  alphadarkfuchsia: string;

  pink: string;
  alphapink: string;
  darkpink: string;
  lightpink: string;
  alphalightpink: string;
  alphadarkpink: string;

  red: string;
  alphared: string;
  darkred: string;
  lightred: string;
  alphalightred: string;
  alphadarkred: string;

  orange: string;
  alphaorange: string;
  darkorange: string;
  lightorange: string;
  alphalightorange: string;
  alphadarkorange: string;

  yellow: string;
  alphayellow: string;
  darkyellow: string;
  lightyellow: string;
  alphalightyellow: string;
  alphadarkyellow: string;

  lime: string;
  alphalime: string;
  darklime: string;
  lightlime: string;
  alphalightlime: string;
  alphadarklime: string;

  green: string;
  alphagreen: string;
  darkgreen: string;
  lightgreen: string;
  alphalightgreen: string;
  alphadarkgreen: string;

  teal: string;
  alphateal: string;
  darkteal: string;
  lightteal: string;
  alphalightteal: string;
  alphadarkteal: string;

  cyan: string;
  alphacyan: string;
  darkcyan: string;
  lightcyan: string;
  alphalightcyan: string;
  alphadarkcyan: string;
}

interface DefaultColorSet {
  primary: keyof Colors;
  secondary: keyof Colors;
  success: keyof Colors;
  danger: keyof Colors;
  warning: keyof Colors;
  info: keyof Colors;
  light: keyof Colors;
  dark: keyof Colors;
  muted: keyof Colors;
  white: keyof Colors;
}

interface Defaults {
  fg: DefaultColorSet;
  bg: DefaultColorSet;
}

interface FontWeights {
  normal: number;
  bold: number;
}

interface Padding {
  x: number;
  y: number;
}

interface Fonts {
  0: string;
  sans: string;
  mono: string;
}

export default interface Theme {
  defaults: Defaults;
  breakpoints: string[];
  space: number[];
  fontSizes: number[];
  fontWeights: FontWeights;
  fonts: Fonts;
  colors: Colors;
  radii: number[];
  shadows: string[];
  rectangularPaddings: Padding[];
  squarePaddings: Padding[];
}
