import { translateSize } from "@/components/styled/system";
import R from "ramda";
import React from "react";
import { theme } from "styled-tools";

import { FocusStealEvent } from "@/components/core/FocusSteal/types";
import FocusSteal  from "../FocusSteal";

import Portal from "../Portal";

import { Box } from "@/components/styled";

import styled from "@emotion/styled";
import { FormattedMessage } from "react-intl";

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

const DefaultStyledTextInput = Box.withComponent("input");

const StyledTextInputBase = styled(({ form, ...props }) => (
  <DefaultStyledTextInput {...props} />
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

StyledTextInputBase.defaultProps = {
  borderColor: "gray",
};

interface Props {
  placeholder: string | FormattedMessage.MessageDescriptor;
  label: string | FormattedMessage.MessageDescriptor;
  value: string;
  size: string;
  state: string;
}

interface State {
  visible: boolean;
}

class StyledTextInput extends React.Component<Props, State> {
  public static defaultProps = {
    state: "default",
    size: "md",
    borderRadius: 2,
  };

  public state = {
    visible: false,
  };

  constructor(props, context) {
    super(props, context);

    this.blurred = this.blurred.bind(this);
    this.focused = this.focused.bind(this);
    this.focusStolen = this.focusStolen.bind(this);
  }

  public showDropdown() {
    this.setState({ visible: true });
  }

  public hideDropdown() {
    this.setState({ visible: false });
  }

  public toggleDropdown() {
    this.setState({ visible: !this.state.visible });
  }

  public blurred(evt: React.SyntheticEvent) {
    this.hideDropdown();
  }

  public focused(evt: React.SyntheticEvent) {
    this.showDropdown();
  }

  public focusStolen(evt: FocusStealEvent) {
    console.log(evt);
  }

  public render() {
    const { props } = this;

    const filteredProps = R.omit(["state", "field", "onFocus", "onBlur", "onChange", "form", "value"], props);

    const state = states[props.state || "default"];
    const newFilteredProps = { ...state, ...filteredProps };

    const input = (
      <StyledTextInputBase
        readOnly
        value={props.value || ""}
        onFocus={this.focused}
        onBlur={this.blurred}
        {...newFilteredProps} />
    );

    return (
      <FocusSteal onSteal={this.focusStolen}>
        <Portal
          span={8}
          onHide={() => this.hideDropdown()}
          visible={this.state.visible}
          reference={input}
          content={<div style={{ padding: 5, backgroundColor: "white", width: 200 }}>xd</div>}/>
      </FocusSteal>
    );
  }
}

export default StyledTextInput;
