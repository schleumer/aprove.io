import { translateSize } from "@/components/styled/system";
import PropTypes from "prop-types";
import R from "ramda";
import React from "react";
import { theme } from "styled-tools";

import { Box } from "@/components/styled";

import styled from "@emotion/styled";

export const defaultState = {
  defaultColor: "black",
  defaultBorderColor: "gray",
  hoverBorderColor: "cyan",
  hoverColor: "black",
  focusColor: "black",
  focusBorderColor: "cyan",
  focusShadowColor: "alphacyan",
};

export const states = {
  default: defaultState,
  primary: {
    defaultColor: "black",
    defaultBorderColor: "blue",
    hoverBorderColor: "blue",
    hoverColor: "black",
    focusColor: "black",
    focusBorderColor: "blue",
    focusShadowColor: "alphablue",
  },
  secondary: {
    defaultColor: "black",
    defaultBorderColor: "darker",
    hoverBorderColor: "darker",
    hoverColor: "black",
    focusColor: "black",
    focusBorderColor: "darker",
    focusShadowColor: "alphadarker",
  },
  success: {
    defaultColor: "black",
    defaultBorderColor: "green",
    hoverBorderColor: "green",
    hoverColor: "black",
    focusColor: "black",
    focusBorderColor: "green",
    focusShadowColor: "alphagreen",
  },
  danger: {
    defaultColor: "black",
    defaultBorderColor: "red",
    hoverBorderColor: "red",
    hoverColor: "black",
    focusColor: "black",
    focusBorderColor: "red",
    focusShadowColor: "alphared",
  },
  warning: {
    defaultColor: "black",
    defaultBorderColor: "yellow",
    hoverBorderColor: "yellow",
    hoverColor: "black",
    focusColor: "black",
    focusBorderColor: "yellow",
    focusShadowColor: "alphayellow",
  },
  info: {
    defaultColor: "black",
    defaultBorderColor: "pink",
    hoverBorderColor: "pink",
    hoverColor: "black",
    focusColor: "black",
    focusBorderColor: "pink",
    focusShadowColor: "alphapink",
  },
};

const defaultSize = R.defaultTo(2);

const themeIt = (props) => {
  const size = translateSize(defaultSize(props.size));

  const padding: any = theme("rectangularPaddings")(props)[size];
  const fontSize: any = theme("fontSizes")(props)[size];

  return {
    fontSize: `${fontSize}rem`,
    lineHeight: `1.5`,
    padding: `${padding.y}rem ${padding.x}rem`,
  };
};

const DefaultStyledTextAreaInput = Box.withComponent("textarea");

const StyledTextAreaInputBase = styled(({ form, ...props }) => (
  <DefaultStyledTextAreaInput {...props} />
))(
  {
    color: "black",
    appearance: "none",
    width: "100%",
    outline: 0,
    display: "block",
  },
  themeIt,
  (props) => ({
    "background": props.disabled ? theme("colors.light")(props) : theme("colors.white")(props),
    "color": theme(`colors.${props.defaultColor}`, props.defaultColor)(props),
    "border": `1px solid ${theme(
      `colors.${props.defaultBorderColor}`,
      props.defaultBorderColor,
    )(props)}`,
    "&:hover": {
      border: `1px solid ${theme(
        `colors.${props.hoverBorderColor}`,
        props.hoverBorderColor,
      )(props)}`,
      color: theme(`colors.${props.hoverColor}`, props.hoverColor)(props),
    },
    "&:focus": {
      color: theme(`colors.${props.focusColor}`, props.focusColor)(props),
      border: `1px solid ${theme(
        `colors.${props.focusBorderColor}`,
        props.focusBorderColor,
      )(props)}`,
      boxShadow: `0px 0px 0px 3px ${theme(
        `colors.${props.focusShadowColor}`,
        props.focusShadowColor,
      )(props)}`,
    },
  }),
);

StyledTextAreaInputBase.defaultProps = {
  borderColor: "gray",
  borderRadius: 2,
};

const StyledTextAreaInput = (props) => {
  const filteredProps = R.omit(["state"], props);

  const state = states[props.state || "default"];
  const newFilteredProps = { ...state, ...filteredProps };

  return <StyledTextAreaInputBase {...newFilteredProps} />;
};

StyledTextAreaInput.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.string,
      defaultMessage: PropTypes.string,
    }),
  ]),
  size: PropTypes.string,
  state: PropTypes.string,
};

StyledTextAreaInput.defaultProps = {
  state: "default",
  size: "md",
};

export default StyledTextAreaInput;
