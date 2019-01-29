/**
 * Based on [rebass](https://github.com/rebassjs/rebass)
 */

import PropTypes from "prop-types";
import { titleCase } from "@b6y/commons";

// utils
const noop = (n) => n;

export const sizeAliases = ["xs", "sm", "md", "lg", "xlg", "xxlg", "xxxlg"];

export const propTypes = {
  numberOrString: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  responsive: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
  ]),
};

export const defaultBreakpoints = [40, 52, 64].map((n) => `${n}em`);
export const is = (n) => n !== undefined && n !== null;
export const num = (n) => typeof n === "number" && !isNaN(n);
export const px = (n) => (num(n) ? `${n}px` : n);
export const em = (n) => (num(n) ? `${n}em` : n);
export const rem = (n) => (num(n) ? `${n}rem` : n);

export const units = { px, em, rem };

export const get = (obj, ...paths) =>
  paths
    .join(".")
    .split(".")
    .reduce((a, b) => (a && a[b] ? a[b] : null), obj);

export const themeGet = (paths, fallback) => (props) =>
  get(props.theme, paths) || fallback;

export const translateSize = <T>(size: string | number, defaultValue = 2) => {
  if (typeof size === "number") {
    return size;
  }

  const pos = sizeAliases.indexOf(size);

  if (pos < 0) {
    return defaultValue;
  }

  return pos;
};

export const merge = (a, b) =>
  Object.assign(
    {},
    a,
    b,
    Object.keys(b || {}).reduce(
      (obj, key) =>
        Object.assign(obj, {
          [key]:
            a[key] !== null && typeof a[key] === "object"
              ? merge(a[key], b[key])
              : b[key],
        }),
      {},
    ),
  );

export const compose = (...funcs) => {
  const fn = (props) =>
    funcs
      .map((fn) => fn(props))
      .filter(Boolean)
      .reduce(merge, {});

  fn.propTypes = funcs.map((fn) => fn.propTypes).reduce(merge, {});
  return fn;
};

export const createMediaQuery = (n) => `@media screen and (min-width: ${px(n)})`;

interface StyleParams {
  prop?: string;
  cssProperty?: string;
  key?: string;
  getter?: (_: any) => any;
  transformValue?: (_: any) => any;
  scale?: number[] | string[];
}

export const style = ({ cssProperty, prop, getter, transformValue, key, scale: defaultScale }: StyleParams) => {
  const css = cssProperty || prop;
  const transform = transformValue || getter || noop;
  const fn = (props) => {
    const val = props[prop];
    if (!is(val)) { return null; }

    const scale = get(props.theme, key) || defaultScale;
    const style = (n) =>
      is(n)
        ? {
          [css]: transform(get(scale, n) || n),
        }
        : null;

    if (!Array.isArray(val)) {
      return style(val);
    }

    // how to hoist this up??
    const breakpoints = [
      null,
      ...(get(props.theme, "breakpoints") || defaultBreakpoints).map(
        createMediaQuery,
      ),
    ];

    let styles = {};

    for (let i = 0; i < val.length; i++) {
      const media = breakpoints[i];
      if (!media) {
        styles = style(val[i]) || {};
        continue;
      }
      const rule = style(val[i]);
      if (!rule) { continue; }
      styles[media] = rule;
    }

    return styles;
  };

  fn.propTypes = { [prop]: propTypes.responsive } as any;

  return fn;
};

export const getWidth = (n) => (!num(n) || n > 1 ? px(n) : `${n * 100}%`);

export const util = {
  propTypes,
  defaultBreakpoints,
  is,
  num,
  px,
  get,
  themeGet,
  merge,
  compose,
  createMediaQuery,
  style,
};

// space
const isNegative = (n) => n < 0;
const REG = /^[mp][trblxy]?$/;
const properties = {
  m: "margin",
  p: "padding",
};
const directions = {
  t: "Top",
  r: "Right",
  b: "Bottom",
  l: "Left",
  x: ["Left", "Right"],
  y: ["Top", "Bottom"],
};

const getProperties = (key) => {
  const [a, b] = key.split("");
  const property = properties[a];
  const direction = directions[b] || "";
  return Array.isArray(direction)
    ? direction.map((dir) => property + dir)
    : [property + direction];
};

export const getValue = (scale, unit = "rem") => (n) => {
  if (!num(n)) {
    return units[unit](scale[n] || n);
  }
  const abs = Math.abs(n);
  const neg = isNegative(n);
  const value = scale[abs] || abs;
  if (!num(value)) {
    return neg ? `-${value}` : value;
  }
  return units[unit](value * (neg ? -1 : 1));
};

const defaultScale = [0, 4, 8, 16, 32, 64, 128, 256, 512];

const defaultSizes = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56];

const defaultFontSizes = [0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6];

export const getSpace = (n) => (props) => {
  const scale = get(props.theme, "space") || defaultScale;
  const getStyle = getValue(scale, "rem");

  return getStyle(n);
};

export const getSize = (n) => (props) => {
  const scale = get(props.theme, "sizes") || defaultSizes;

  const getStyle = getValue(scale, "rem");

  return getStyle(n);
};

export const getFontSize = (n) => (props) => {
  const scale = get(props.theme, "fontSizes") || defaultFontSizes;
  const getStyle = getValue(scale, "rem");

  return getStyle(n);
};

export const space = (props) => {
  const keys = Object.keys(props)
    .filter((key) => REG.test(key))
    .sort();
  const scale = get(props.theme, "space") || defaultScale;
  const getStyle = getValue(scale);

  return keys
    .map((key) => {
      const value = props[key];
      const properties = getProperties(key);

      const style = (n) =>
        is(n)
          ? properties.reduce(
          (a, prop) => ({
            ...a,
            [prop]: getStyle(n),
          }),
          {},
          )
          : null;

      if (!Array.isArray(value)) {
        return style(value);
      }

      const breakpoints = [
        null,
        ...(get(props.theme, "breakpoints") || defaultBreakpoints).map(
          createMediaQuery,
        ),
      ];

      let styles = {};

      for (let i = 0; i < value.length; i++) {
        const media = breakpoints[i];
        if (!media) {
          styles = style(value[i]) || {};
          continue;
        }
        const rule = style(value[i]);
        if (!rule) { continue; }
        styles[media] = rule;
      }

      return styles;
    })
    .reduce(merge, {});
};

space.propTypes = {
  m: propTypes.responsive,
  mt: propTypes.responsive,
  mr: propTypes.responsive,
  mb: propTypes.responsive,
  ml: propTypes.responsive,
  mx: propTypes.responsive,
  my: propTypes.responsive,
  p: propTypes.responsive,
  pt: propTypes.responsive,
  pr: propTypes.responsive,
  pb: propTypes.responsive,
  pl: propTypes.responsive,
  px: propTypes.responsive,
  py: propTypes.responsive,
};

// styles
export const width = style({
  prop: "width",
  transformValue: getWidth,
});

export const height = style({
  prop: "height",
  transformValue: getWidth,
});

export const fontSize = style({
  prop: "fontSize",
  key: "fontSizes",
  transformValue: rem,
  scale: [0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6],
});

export const textColor = style({
  prop: "color",
  key: "colors",
});

export const bgColor = style({
  prop: "bg",
  cssProperty: "backgroundColor",
  key: "colors",
});

export const textDecoration = style({
  prop: "textDecoration",
});

export const color = compose(
  textColor,
  bgColor,
);

// typography
export const fontFamily = style({
  prop: "fontFamily",
  key: "fonts",
});

export const textAlign = style({
  prop: "textAlign",
});

export const lineHeight = style({
  prop: "lineHeight",
  key: "lineHeights",
  transformValue: rem,
  scale: [0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6],
});

export const fontWeight = style({
  prop: "fontWeight",
  key: "fontWeights",
});

export const fontStyle = style({
  prop: "fontStyle",
});

export const letterSpacing = style({
  prop: "letterSpacing",
  key: "letterSpacings",
  transformValue: rem,
});

// layout
export const display = style({
  prop: "display",
});

export const maxWidth = style({
  prop: "maxWidth",
  key: "maxWidths",
  transformValue: rem,
});

export const minWidth = style({
  prop: "minWidth",
  key: "minWidths",
  transformValue: rem,
});

export const maxHeight = style({
  prop: "maxHeight",
  key: "maxHeights",
  transformValue: rem,
});

export const minHeight = style({
  prop: "minHeight",
  key: "minHeights",
  transformValue: rem,
});

export const sizeWidth = style({
  prop: "size",
  cssProperty: "width",
  transformValue: rem,
});

export const sizeHeight = style({
  prop: "size",
  cssProperty: "height",
  transformValue: rem,
});

export const size = compose(
  sizeHeight,
  sizeWidth,
);

export const ratioPadding = style({
  prop: "ratio",
  cssProperty: "paddingBottom",
  transformValue: (n) => `${n * 100}%`,
});

export const ratio = (props) =>
  props.ratio
    ? {
      height: 0,
      ...ratioPadding(props),
    }
    : null;
ratio.propTypes = {
  ...ratioPadding.propTypes,
};

export const verticalAlign = style({
  prop: "verticalAlign",
});

// flexbox
export const alignItems = style({
  prop: "alignItems",
});

export const alignContent = style({
  prop: "alignContent",
});

export const justifyItems = style({
  prop: "justifyItems",
});

export const justifyContent = style({
  prop: "justifyContent",
});

export const flexWrap = style({
  prop: "flexWrap",
});

export const flexBasis = style({
  prop: "flexBasis",
  transformValue: getWidth,
});

export const flexDirection = style({
  prop: "flexDirection",
});

export const flex = style({
  prop: "flex",
});

export const justifySelf = style({
  prop: "justifySelf",
});

export const alignSelf = style({
  prop: "alignSelf",
});

export const order = style({
  prop: "order",
});

// grid
export const gridGap = style({
  prop: "gridGap",
  transformValue: rem,
  key: "space",
});

export const gridColumnGap = style({
  prop: "gridColumnGap",
  transformValue: rem,
  key: "space",
});

export const gridRowGap = style({
  prop: "gridRowGap",
  transformValue: rem,
  key: "space",
});

export const gridColumn = style({
  prop: "gridColumn",
});

export const gridRow = style({
  prop: "gridRow",
});

export const gridAutoFlow = style({
  prop: "gridAutoFlow",
});

export const gridAutoColumns = style({
  prop: "gridAutoColumns",
});

export const gridAutoRows = style({
  prop: "gridAutoRows",
});

export const gridTemplateColumns = style({
  prop: "gridTemplateColumns",
});

export const gridTemplateRows = style({
  prop: "gridTemplateRows",
});

export const gridTemplateAreas = style({
  prop: "gridTemplateAreas",
});

export const gridArea = style({
  prop: "gridArea",
});

// borders
const getBorder = (n) => (num(n) && n > 0 ? `${n}px solid` : n);

export const border = style({
  prop: "border",
  key: "borders",
  transformValue: getBorder,
});

export const borderTop = style({
  prop: "borderTop",
  key: "borders",
  transformValue: getBorder,
});

export const borderRight = style({
  prop: "borderRight",
  key: "borders",
  transformValue: getBorder,
});

export const borderBottom = style({
  prop: "borderBottom",
  key: "borders",
  transformValue: getBorder,
});

export const borderLeft = style({
  prop: "borderLeft",
  key: "borders",
  transformValue: getBorder,
});

export const borders = compose(
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
);

export const borderColor = style({
  prop: "borderColor",
  key: "colors",
});

export const borderRadius = style({
  prop: "borderRadius",
  key: "radii",
  transformValue: rem,
});

export const boxShadow = style({
  prop: "boxShadow",
  key: "shadows",
});

export const opacity = style({
  prop: "opacity",
});

export const overflow = style({
  prop: "overflow",
});

// backgrounds
export const background = style({
  prop: "background",
});

export const backgroundImage = style({
  prop: "backgroundImage",
});

export const backgroundSize = style({
  prop: "backgroundSize",
});

export const backgroundPosition = style({
  prop: "backgroundPosition",
});

export const backgroundRepeat = style({
  prop: "backgroundRepeat",
});

// position
export const position = style({
  prop: "position",
});

export const zIndex = style({
  prop: "zIndex",
});

export const top = style({
  prop: "top",
  transformValue: rem,
});

export const right = style({
  prop: "right",
  transformValue: rem,
});

export const bottom = style({
  prop: "bottom",
  transformValue: rem,
});

export const left = style({
  prop: "left",
  transformValue: rem,
});

export const styles = {
  space,
  width,
  fontSize,
  textColor,
  bgColor,
  color,
  fontFamily,
  textAlign,
  lineHeight,
  fontWeight,
  fontStyle,
  letterSpacing,
  display,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  sizeWidth,
  sizeHeight,
  size,
  ratioPadding,
  ratio,
  verticalAlign,
  alignItems,
  alignContent,
  justifyItems,
  justifyContent,
  flexWrap,
  flexBasis,
  flexDirection,
  flex,
  justifySelf,
  alignSelf,
  order,
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea,
  // borders
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borders,
  borderColor,
  borderRadius,
  boxShadow,
  opacity,
  overflow,
  background,
  backgroundImage,
  backgroundPosition,
  backgroundRepeat,
  backgroundSize,
  position,
  zIndex,
  top,
  right,
  bottom,
  left,
  textDecoration,
};

// mixed
const omit = (obj, blacklist) => {
  const next = {};
  for (const key in obj) {
    if (blacklist.indexOf(key) > -1) { continue; }
    next[key] = obj[key];
  }
  return next;
};

const funcs = Object.keys(styles)
  .map((key) => styles[key])
  .filter((fn) => typeof fn === "function");

const blacklist = funcs.reduce(
  (a, fn) => [...a, ...Object.keys(fn.propTypes || {})],
  ["theme"],
);

export const mixed = (props) =>
  funcs.map((fn) => fn(props)).reduce(merge, omit(props, blacklist));

// @ts-ignore
export const genTypes = () => {
  // tslint:disable-next-line:forin
  for (const i in styles) {
    const name = titleCase(i);
    console.log(`export interface With${name} {`);
    const types = styles[i].propTypes;
    // tslint:disable-next-line:forin
    for (const propKey in types) {
      const prop = types[propKey];

      if (prop === propTypes.numberOrString) {
        console.log(`  ${propKey}?: NumberOrStringProp;`);
      } else if (prop === propTypes.responsive) {
        console.log(`  ${propKey}?: ResponsiveProp;`);
      } else {
        console.log(`  ${propKey}?: ${prop.name};`);
      }
    }
    console.log("}");
  }
};
