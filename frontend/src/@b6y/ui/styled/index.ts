import styled from "@emotion/styled";

import {
  alignContent,
  alignItems,
  alignSelf,
  borderColor,
  borderRadius,
  borders, boxShadow,
  color,
  flex,
  flexBasis,
  flexDirection,
  flexWrap,
  fontFamily,
  fontSize,
  fontWeight,
  height,
  justifyContent,
  justifyItems,
  justifySelf,
  letterSpacing,
  lineHeight,
  order,
  space,
  textAlign,
  textDecoration,
  verticalAlign,
  width,
} from "./system";

import * as types from "./types";

import { theme } from "styled-tools";

const css = (props) => props.css;
const themed = (key) => (props) => props.theme[key];

export const Box: types.Styled<HTMLDivElement, types.Box> = styled("div")(
  space,
  width,
  height,
  fontSize,
  lineHeight,
  color,
  flex,
  order,
  alignSelf,
  justifySelf,
  borderRadius,
  borders,
  borderColor,
  textDecoration,
  verticalAlign,
  boxShadow,
  themed("Box"),
  css,
);

Box.propTypes = {
  ...space.propTypes,
  ...width.propTypes,
  ...fontSize.propTypes,
  ...color.propTypes,
  ...flex.propTypes,
  ...order.propTypes,
  ...alignSelf.propTypes,
  ...justifySelf.propTypes,
  ...borderRadius.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...verticalAlign.propTypes,
  ...boxShadow.propTypes,
};

export const SpanBox = styled(Box.withComponent("span"))(
  themed("SpanBox"),
);

SpanBox.propTypes = {
  ...Box.propTypes,
};

export const Flex = styled(Box)(
  {
    display: "flex",
  },
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent,
  flexBasis,
  alignContent,
  justifyItems,
  themed("Flex"),
);

Flex.propTypes = {
  ...Box.propTypes,
  ...flexWrap.propTypes,
  ...flexDirection.propTypes,
  ...alignItems.propTypes,
  ...justifyContent.propTypes,
  ...flexBasis.propTypes,
  ...alignContent.propTypes,
  ...justifyItems.propTypes,
};

export const Text = styled(Box)(
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
  themed("Text"),
);

Text.propTypes = {
  ...Box.propTypes,
  ...fontFamily.propTypes,
  ...fontWeight.propTypes,
  ...textAlign.propTypes,
  ...lineHeight.propTypes,
  ...letterSpacing.propTypes,
};

export const Heading = styled(Text)(
  (props) => ({
    borderBottom: `1px solid ${theme("colors.light")(props)}`,
  }),
  themed("Heading"),
);

Heading.defaultProps = {
  as: "h2",
  m: 0,
  p: 2,
  mb: 2,
  fontSize: 3,
  fontWeight: "400",
};

Heading.propTypes = {
  ...Text.propTypes,
};

export const Link = styled(Box)(themed("Link"));

Link.defaultProps = {
  as: "a",
  color: "blue",
};

export const Image = styled(Box)(
  {
    maxWidth: "100%",
    height: "auto",
  },
  height,
  borderRadius,
  themed("Image"),
);

Image.propTypes = {
  ...Box.propTypes,
  ...height.propTypes,
  ...borderRadius.propTypes,
};

Image.defaultProps = {
  as: "img",
  m: 0,
};
