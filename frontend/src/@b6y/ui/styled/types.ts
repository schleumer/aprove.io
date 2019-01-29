import { StyledComponent } from "@emotion/styled";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import * as gentypes from "./generatedTypes";

export interface Styled<BaseProps, Element> extends StyledComponent<DetailedHTMLProps<HTMLAttributes<Element>, Element> & BaseProps, any, any> {}

export interface WithCSS {
  css?: any;
}

export interface Box extends
  gentypes.WithFontWeight,
  gentypes.WithSpace,
  gentypes.WithHeight,
  gentypes.WithWidth,
  gentypes.WithFontSize,
  gentypes.WithColor,
  gentypes.WithFlex,
  gentypes.WithOrder,
  gentypes.WithAlignSelf,
  gentypes.WithJustifySelf,
  gentypes.WithBorderRadius,
  gentypes.WithBorders,
  gentypes.WithBorderColor,
  gentypes.WithVerticalAlign,
  gentypes.WithBoxShadow,
  WithCSS {}

export interface Flex extends
  Box,
  gentypes.WithFlexWrap,
  gentypes.WithFlexDirection,
  gentypes.WithFlexBasis,
  gentypes.WithAlignItems,
  gentypes.WithJustifyContent {}

export interface SpanBox extends Box {}
