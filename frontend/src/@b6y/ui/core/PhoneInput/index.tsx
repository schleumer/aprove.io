import styled from "@emotion/styled";
import PropTypes from "prop-types";
import R from "ramda";
import React from "react";
import { FormattedMessage } from "react-intl";
import Phone from "react-phone-number-input/max";
import { theme } from "styled-tools";

import { Box } from "../../styled";
import { translateSize } from "../../styled/system";

export const defaultState = {
  defaultColor: "black",
  defaultBorderColor: "gray",
  hoverBorderColor: "cyan",
  hoverColor: "black",
  focusColor: "black",
  focusBorderColor: "cyan",
  focusShadowColor: "alphacyan",
};

interface PhoneInputStateValues {
  [key: string]: any;
}
interface PhoneInputStates {
  default: PhoneInputStateValues;
  primary: PhoneInputStateValues;
  secondary: PhoneInputStateValues;
  success: PhoneInputStateValues;
  danger: PhoneInputStateValues;
  warning: PhoneInputStateValues;
  info: PhoneInputStateValues;
}

export const states: PhoneInputStates = {
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

const StyledInputBase = styled(Box)(
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
    "&:focus, &.focused": {
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

StyledInputBase.defaultProps = {
  borderColor: "gray",
  borderRadius: 2,
};

// @ts-ignore
const InputWrapper = styled(StyledInputBase)`
  position: relative;

  .react-phone-number-input {
  }

  .react-phone-number-input__row
  {
    display     : flex;
    align-items : center;
  }

  .react-phone-number-input__phone
  {
    flex : 1;
    min-width : 0;
  }

  .react-phone-number-input__icon
  {
    line-height: 0;
    width      : 1.24em;
    height     : 0.93em;
    box-sizing : content-box;
  }

  .react-phone-number-input__icon--international
  {
    width  : calc(0.93em + 2px);
    height : calc(0.93em + 2px);
    padding-left  : 0.155em;
    padding-right : 0.155em;

    border : none;
  }

  .react-phone-number-input__error
  {
    margin-left : calc(1.24em + 2px + 0.3em + 0.35em + 0.5em);
    margin-top  : calc(0.3rem);
    color       : #D30F00;
  }

  .react-phone-number-input__icon-image
  {
    max-width  : 100%;
    max-height : 100%;
  }

  .react-phone-number-input__ext-input::-webkit-inner-spin-button,
  .react-phone-number-input__ext-input::-webkit-outer-spin-button
  {
    margin             : 0 !important;
    -webkit-appearance : none !important;
    -moz-appearance    : textfield !important;
  }

  .react-phone-number-input__ext-input
  {
    width : 3em;
  }

  .react-phone-number-input__ext
  {
    white-space: nowrap;
  }

  .react-phone-number-input__ext,
  .react-phone-number-input__ext-input
  {
    margin-left : 0.5em;
  }

  .react-phone-number-input__country--native
  {
    position     : relative;
    align-self   : stretch;
    display      : flex;
    align-items  : center;
    margin-right : 0.5em;
  }

  .react-phone-number-input__country-select
  {
    position : absolute;
    top      : 0;
    left     : 0;
    height   : 100%;
    width    : 100%;
    z-index  : 1;
    border   : 0;
    opacity  : 0;
    cursor   : pointer;
  }

  .react-phone-number-input__country-select-arrow
  {
    display            : block;
    content            : '';
    width              : 0;
    height             : 0;
    margin-bottom      : 0.1em;
    margin-top         : 0.3em;
    margin-left        : 0.3em;
    border-width       : 0.35em 0.2em 0 0.2em;
    border-style       : solid;
    border-left-color  : transparent;
    border-right-color : transparent;
    color              : #B8BDC4;
    opacity            : 0.7;
    transition         : color 0.1s;
  }

  .react-phone-number-input__country-select-divider
  {
    font-size  : 1px;
    background : black;
  }

  .react-phone-number-input__country-select:focus + .react-phone-number-input__country-select-arrow,
  .react-phone-number-input__country.rrui__select--focus .rrui__select__arrow
  {
    color : #03B2CB;
  }

  .react-phone-number-input__input
  {
    height        : auto;
    outline       : none;
    padding       : 0;
    appearance    : none;
    border        : none;
    transition    : border 0.1s;
    font-size     : inherit;
  }

  .react-phone-number-input__input:focus
  {
    border-color : #03B2CB;
  }

  .react-phone-number-input__input--disabled
  {
    cursor : default;
  }

  .react-phone-number-input__input--invalid,
  .react-phone-number-input__input--invalid:focus
  {
    border-color : #EB2010;
  }

  .react-phone-number-input__input:-webkit-autofill
  {
    box-shadow : 0 0 0 1000px white inset;
  }

  .react-phone-number-input__country .rrui__select__button
  {
    border-bottom : none;
  }
`;

interface StyledInputProps {
  onChange?: (value?: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder: string | FormattedMessage.MessageDescriptor;
  label: string | FormattedMessage.MessageDescriptor;
  value: string;
  state: keyof PhoneInputStates;
}
interface StyledInputState {
  focused: boolean;
}

class StyledInput extends React.Component<StyledInputProps, StyledInputState> {
  public static propTypes = {
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

  public static defaultProps = {
    state: "default",
    size: "md",
  };

  constructor(a) {
    super(a);

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      focused: false,
    };
  }

  public onChange(value) {
    if (R.isNil(value) || R.isEmpty(value)) {
      if (this.props.onChange) {
        this.props.onChange(null);
      }
    } else {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  public onFocus() {
    this.setState({ focused: true });

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  public onBlur() {
    this.setState({ focused: false });

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  public render() {
    const { focused } = this.state;
    const { value } = this.props;
    const filteredProps = R.omit(["state", "field", "onBlur", "onChange", "form"], this.props);

    const state = states[this.props.state || "default"];
    const newFilteredProps = { ...state, ...filteredProps };

    return (
      <InputWrapper {...newFilteredProps} className={focused && "focused"}>
        <Phone {...filteredProps}
               onFocus={this.onFocus}
               onBlur={this.onBlur}
               onChange={this.onChange}
               value={value} />
      </InputWrapper>
    );
  }
}

export default StyledInput;
