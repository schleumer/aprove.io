import styled from "@emotion/styled";
import React, { ReactElement } from 'react';
import ReactDOM from "react-dom";

import * as R from "ramda";

import { Box } from "@/components/styled";

import { Props, State } from "./types";

const TooltipElement = styled((props) => {
  const newProps = R.omit(
    [
      "visible",
      "top",
      "left",
      "translateTop",
      "translateBottom",
      "translateLeft",
      "translateRight",
    ],
    props,
  );

  return <Box {...newProps} />;
})`
  display: ${({ visible }) => (visible ? "block" : "none")};
  position: fixed;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
  z-index: 9999999;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  ${({ translateTop }) =>
    translateTop && "transform: translateX(-50%) translateY(-100%)"}
  ${({ translateBottom }) => translateBottom && "transform: translateX(-50%)"}
  ${({ translateLeft }) =>
    translateLeft && "transform: translateX(-100%) translateY(-50%)"}
  ${({ translateRight }) =>
    translateRight && "transform: translateX(0%) translateY(-50%)"}
`;

class Tooltip extends React.Component<Props, State> {

  public static defaultProps = {
    position: "top",
  };
  public state = {
    visible: false,
    elTop: 0,
    elLeft: 0,
    translateTop: false,
    translateBottom: false,
    translateLeft: false,
    translateRight: false,
  };

  public el = document.createElement("div");
  public tooltip = null;

  constructor(a, b) {
    super(a, b);

    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  public componentDidMount() {
    this.el = document.createElement("div");

    const portalDOM = document.getElementById("portal-target");

    portalDOM.appendChild(this.el);
  }

  public componentDidUpdate() {}

  public componentWillUnmount() {
    const portalDOM = document.getElementById("portal-target");

    portalDOM.removeChild(this.el);

    this.el = null;
  }

  public onEnter(evt) {
    const { position } = this.props;
    const rect = evt.target.getBoundingClientRect();

    let translateTop = false;
    let translateBottom = false;
    let translateLeft = false;
    let translateRight = false;

    const { x, y, width, height } = rect;

    let left = 0;
    let top = 0;

    if (position === "top") {
      left = x + width / 2;
      top = y - 5;
      translateTop = true;
    } else if (position === "bottom") {
      left = x + width / 2;
      top = y + height + 5;
      translateBottom = true;
    } else if (position === "left") {
      left = x - 5;
      top = y + height / 2;
      translateLeft = true;
    } else if (position === "right") {
      left = x + width + 5;
      top = y + height / 2;
      translateRight = true;
    }

    this.setState({
      visible: true,
      translateTop,
      translateBottom,
      translateLeft,
      translateRight,
      elTop: `${top}px`,
      elLeft: `${left}px`,
    });
  }

  public onLeave() {
    this.setState({
      visible: false,
      elTop: 0,
      elLeft: 0,
      translateTop: false,
      translateBottom: false,
      translateLeft: false,
      translateRight: false,
    });
  }

  public render() {
    const {
      visible,
      elTop,
      elLeft,
      translateTop,
      translateBottom,
      translateLeft,
      translateRight,
    } = this.state;

    const { children, text } = this.props;

    // TODO: verify runtime type pl0x
    const child = React.Children.only(children) as ReactElement<any>;
    const childProps: {
      onMouseEnter?: (evt: any) => void;
      onMouseLeave?: (evt: any) => void;
      key?: string;
    } = {};

    const tooltip = ReactDOM.createPortal(
      <TooltipElement
        bg="black"
        color="white"
        visible={visible}
        top={elTop}
        left={elLeft}
        translateTop={translateTop}
        translateBottom={translateBottom}
        translateLeft={translateLeft}
        translateRight={translateRight}
      >
        {text}
      </TooltipElement>,
      this.el,
    );

    childProps.onMouseEnter = this.onEnter;
    childProps.onMouseLeave = this.onLeave;
    childProps.key = "el";

    return [tooltip, React.cloneElement(child, childProps)];
  }
}

// Tooltip.defaultProps = {
//   position: 'top',
// };
//
// Tooltip.propTypes = {
//   children: PropTypes.element,
//   position: PropTypes.string,
//   text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
// };

export default Tooltip;
