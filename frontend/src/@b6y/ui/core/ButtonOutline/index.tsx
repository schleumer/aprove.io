import styled from "@emotion/styled";
import R from "ramda";
import React from "react";

import { theme } from "styled-tools";
import { Box } from "../../styled";
import { getSize, translateSize } from "../../styled/system";

import { SvgIcon } from "../Icon";

const defaultSize = R.defaultTo(2);
const iconMargin = getSize(1);

const defaultState = {
  color: "black",
  borderColor: "black",
  hover: {
    color: "black",
    borderColor: "black",
  },
  focus: {
    color: "black",
    borderColor: "black",
  },
};

const states = {
  default: defaultState,
  primary: {
    color: "blue",
    borderColor: "blue",
    hover: {
      color: "blue",
      borderColor: "blue",
    },
    focus: {
      color: "blue",
      borderColor: "blue",
    },
  },
  secondary: {
    color: "grayer",
    borderColor: "grayer",
    hover: {
      color: "grayer",
      borderColor: "grayer",
    },
    focus: {
      color: "grayer",
      borderColor: "grayer",
    },
  },
  success: {
    color: "green",
    borderColor: "green",
    hover: {
      color: "green",
      borderColor: "green",
    },
    focus: {
      color: "green",
      borderColor: "green",
    },
  },
  danger: {
    color: "red",
    borderColor: "red",
    hover: {
      color: "red",
      borderColor: "red",
    },
    focus: {
      color: "red",
      borderColor: "red",
    },
  },
  warning: {
    color: "yellow",
    borderColor: "yellow",
    hover: {
      color: "yellow",
      borderColor: "yellow",
    },
    focus: {
      color: "yellow",
      borderColor: "yellow",
    },
  },
  info: {
    color: "fuchsia",
    borderColor: "fuchsia",
    hover: {
      color: "fuchsia",
      borderColor: "fuchsia",
    },
    focus: {
      color: "fuchsia",
      borderColor: "fuchsia",
    },
  },
};

const themeHeight = (props) => {
  const size = translateSize(defaultSize(props.size));

  const padding: any = theme("rectangularPaddings")(props)[size];
  const fontSize: any = theme("fontSizes")(props)[size];

  return {
    fontSize: `${fontSize}rem`,
    lineHeight: `1.5`,
    padding: `${padding.y}rem ${padding.x}rem`,
  };
};

const ButtonOutline = styled(Box.withComponent("button"))(
  (props) => ({
    backgroundClip: "padding-box",
    background: "transparent",

    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    outline: "none",
    color: theme(`colors.${props.color}`, props.color)(props),
  }),
  themeHeight,
  (props) => ({
    "border": `1px solid ${theme(
      `colors.${props.borderColor}`,
      props.hover.borderColor,
    )(props)}`,
    "&:hover": {
      border: `1px solid ${theme(
        `colors.${props.borderColor}`,
        props.hover.borderColor,
      )(props)}`,
      color: theme(`colors.${props.hover.color}`, props.hover.color)(props),
      boxShadow: `0px 0px 0px 3px ${theme(`colors.alphacyan`)(props)}`,
    },
    "&:focus": {
      border: `1px solid ${theme(
        `colors.${props.borderColor}`,
        props.hover.borderColor,
      )(props)}`,
      color: theme(`colors.${props.focus.color}`, props.focus.color)(props),
      boxShadow: `0px 0px 0px 3px ${theme(`colors.alphacyan`)(props)}`,
    },
    [`& ${SvgIcon} + *`]: {
      marginLeft: iconMargin(props),
    },
  }),
);

ButtonOutline.defaultProps = {
  as: "button",
  type: "button",
  size: "md",
  borderRadius: 2,
  borderColor: "transparent",
  ...defaultState,
};

ButtonOutline.displayName = "ButtonOutline";

const ButtonOutlineState = (props) => {
  const state = states[props.state || "default"];
  const newProps = { ...state, ...props };

  return <ButtonOutline {...newProps} />;
};

ButtonOutlineState.propTypes = {
  ...ButtonOutline.propTypes,
};

export default ButtonOutlineState;
