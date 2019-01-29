import styled from "@emotion/styled";
import { lighten } from "polished";
import R from "ramda";
import React from "react";

import { theme } from "styled-tools";
import { Box } from "../../styled";
import { getSize, translateSize } from "../../styled/system";
import * as types from "../../styled/types";

import { SvgIcon } from "../Icon";

const defaultSize = R.defaultTo(2);
const iconMargin = getSize(1);

const defaultState = {
  color: "black",
  bg: "gray",
  hover: {
    color: "black",
    bg: "grayer",
    outline: "alphacyan",
  },
  focus: {
    color: "black",
    bg: "grayer",
    outline: "alphacyan",
  },
};

const states = {
  default: defaultState,
  primary: {
    color: "white",
    bg: "blue",
    hover: {
      color: "white",
      bg: "darkblue",
      outline: "alphacyan",
    },
    focus: {
      color: "white",
      bg: "darkblue",
      outline: "alphacyan",
    },
  },
  secondary: {
    color: "white",
    bg: "darker",
    hover: {
      color: "white",
      bg: "black",
      outline: "alphacyan",
    },
    focus: {
      color: "white",
      bg: "black",
      outline: "alphacyan",
    },
  },
  success: {
    color: "white",
    bg: "green",
    hover: {
      color: "white",
      bg: "darkgreen",
      outline: "alphacyan",
    },
    focus: {
      color: "white",
      bg: "darkgreen",
      outline: "alphacyan",
    },
  },
  danger: {
    color: "white",
    bg: "red",
    hover: {
      color: "white",
      bg: "darkred",
      outline: "alphacyan",
    },
    focus: {
      color: "white",
      bg: "darkred",
      outline: "alphacyan",
    },
  },
  warning: {
    color: "black",
    bg: "yellow",
    hover: {
      color: "black",
      bg: "darkyellow",
      outline: "alphacyan",
    },
    focus: {
      color: "black",
      bg: "darkyellow",
      outline: "alphacyan",
    },
  },
  info: {
    color: "white",
    bg: "fuchsia",
    hover: {
      color: "white",
      bg: "darkfuchsia",
      outline: "alphacyan",
    },
    focus: {
      color: "white",
      bg: "darkfuchsia",
      outline: "alphacyan",
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

interface Props extends types.Box {}

const Button: types.Styled<Props, HTMLButtonElement> = styled(Box.withComponent("button"))(
  (props) => ({
    appearance: "none",
    display: "inline-block",
    backgroundColor: theme(`colors.${props.bg}`, props.bg)(props),
    cursor: "pointer",
    outline: "none",
    border: `1px solid ${theme(`colors.${props.bg}`, props.bg)(props)}`,
    color: theme(`colors.${props.color}`, props.color)(props),
  }),
  themeHeight,
  (props) => ({
    "&[disabled]": {
      cursor: "not-allowed",
      backgroundColor: lighten(
        0.2,
        theme(`colors.${props.bg}`, props.bg)(props),
      ),
    },
    "&:hover": {
      border: `1px solid ${theme(`colors.${props.hover.bg}`, props.hover.bg)(
        props,
      )}`,
      color: theme(`colors.${props.hover.color}`, props.hover.color)(props),
      backgroundColor: theme(`colors.${props.hover.bg}`, props.hover.bg)(props),
      boxShadow: `0px 0px 0px 3px ${theme(
        `colors.${props.hover.outline}`,
        props.hover.outline,
      )(props)}`,
    },
    "&:focus": {
      border: `1px solid ${theme(`colors.${props.focus.bg}`, props.focus.bg)(
        props,
      )}`,
      color: theme(`colors.${props.focus.color}`, props.focus.color)(props),
      backgroundColor: theme(`colors.${props.focus.bg}`, props.focus.bg)(props),
      boxShadow: `0px 0px 0px 3px ${theme(
        `colors.${props.focus.outline}`,
        props.focus.outline,
      )(props)}`,
    },
    "&[disabled]:hover": {
      backgroundColor: lighten(
        0.2,
        theme(`colors.${props.hover.bg}`, props.hover.bg)(props),
      ),
    },
    "&[disabled]:focus": {
      backgroundColor: lighten(
        0.2,
        theme(`colors.${props.focus.bg}`, props.focus.bg)(props),
      ),
    },
    [`& ${SvgIcon} + *`]: {
      marginLeft: iconMargin(props),
    },
  }),
);

Button.defaultProps = {
  type: "button",
  size: "md",
  borderRadius: 2,
  ...defaultState,
};

const ButtonState = (props) => {
  const state = states[props.state || "default"];
  const newProps = { ...state, ...props };

  return <Button {...newProps} />;
};

export default ButtonState;
