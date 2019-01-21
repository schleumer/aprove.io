import React from "react";
import ReactDOM from "react-dom";
import { InjectedScrollProps, listenToScroll } from "../ScrollController";

interface Props extends InjectedScrollProps {
  visible: boolean;
  reference: React.ReactElement<any>;
  content: React.ReactNode;
  span?: number;
  left?: number;
  top?: number;
}
interface State {}

class Portal extends React.Component<Props, State> {
  public static defaultProps = {
    span: 0,
  };

  public state = {
    top: null,
    left: null,
  };

  public componentDidMount(): void {
    const node = ReactDOM.findDOMNode(this);
    if (node instanceof HTMLElement) {
      console.log(this.props.getRect(node));
    }
  }

  public componentDidUpdate(): void {
  }

  public render() {
    const portal = ReactDOM.createPortal(
      <div style={{ position: "absolute", zIndex: 9999, top: this.state.top, left: this.state.left }}>
        { this.props.content }
      </div>,
      document.getElementById("portal-target"),
    );

    return (
      <React.Fragment>
        {this.props.reference}
        {portal}
      </React.Fragment>
    );
  }
}

export default listenToScroll(Portal);
