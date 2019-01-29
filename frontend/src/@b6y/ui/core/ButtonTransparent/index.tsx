import R from "ramda";
import React from "react";
import { theme } from "styled-tools";

import styled from "@emotion/styled";

import { Box } from "../../styled";
import { getSize, translateSize } from "../../styled/system";

import { SvgIcon } from "../Icon";

const defaultSize = R.defaultTo(2);
const iconMargin = getSize(1);

const defaultState = {
  color: "black",
  hover: {
    color: "black",
    outline: "alphablack",
  },
  focus: {
    color: "black",
    outline: "alphablack",
  },
};

const states = {
  default: defaultState,
  primary: {
    color: "blue",
    hover: {
      color: "blue",
      outline: "alphablue",
    },
    focus: {
      color: "blue",
      outline: "alphablue",
    },
  },
  secondary: {
    color: "gray",
    hover: {
      color: "gray",
      outline: "alphagray",
    },
    focus: {
      color: "gray",
      outline: "alphagray",
    },
  },
  success: {
    color: "green",
    hover: {
      color: "green",
      outline: "alphagreen",
    },
    focus: {
      color: "green",
      outline: "alphagreen",
    },
  },
  danger: {
    color: "red",
    hover: {
      color: "red",
      outline: "alphared",
    },
    focus: {
      color: "red",
      outline: "alphared",
    },
  },
  warning: {
    color: "yellow",
    hover: {
      color: "yellow",
      outline: "alphayellow",
    },
    focus: {
      color: "yellow",
      outline: "alphayellow",
    },
  },
  info: {
    color: "fuchsia",
    hover: {
      color: "fuchsia",
      outline: "alphafuchsia",
    },
    focus: {
      color: "fuchsia",
      outline: "alphafuchsia",
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

const ButtonTransparent = styled(Box.withComponent("button"))(
  {
    backgroundClip: "padding-box",
    lineHeight: "100%",
    background: "transparent",

    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    outline: "none",
  },
  themeHeight,
  (props) => ({
    "border": `1px solid transparent`,
    "&:hover": {
      border: `1px solid ${theme(`colors.${props.color}`, props.hover.color)(
        props,
      )}`,
      color: theme(`colors.${props.hover.color}`, props.hover.color)(props),
      boxShadow: `0px 0px 0px 3px ${theme(
        `colors.${props.focus.outline}`,
        props.focus.outline,
      )(props)}`,
    },
    "&:focus": {
      border: `1px solid ${theme(`colors.${props.color}`, props.hover.color)(
        props,
      )}`,
      color: theme(`colors.${props.focus.color}`, props.focus.color)(props),
      boxShadow: `0px 0px 0px 3px ${theme(
        `colors.${props.focus.outline}`,
        props.focus.outline,
      )(props)}`,
    },
    [`& ${SvgIcon} + *`]: {
      marginLeft: iconMargin(props),
    },
  }),
);

ButtonTransparent.defaultProps = {
  as: "button",
  type: "button",
  size: "md",
  borderRadius: 2,
  border: 0,
  ...defaultState,
};

ButtonTransparent.displayName = "ButtonTransparent";

const ButtonTransparentState = (props) => {
  const state = states[props.state || "default"];
  const newProps = { ...state, ...props };

  return <ButtonTransparent {...newProps} />;
};

ButtonTransparentState.propTypes = {
  ...ButtonTransparent.propTypes,
};

export default ButtonTransparentState;
