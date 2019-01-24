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

interface State {
  top?: number;
  left?: number;
}

class Portal extends React.Component<Props, State> {
  public static defaultProps = {
    span: 0,
  };

  public state = {
    top: null,
    left: null,
    oldId: null,
  };

  public componentDidMount(): void {
    const node = ReactDOM.findDOMNode(this);
    if (node instanceof HTMLElement) {
      const rect = this.props.getRect(node);

      const newTop = rect.top + rect.height;
      const newLeft = rect.left;

      this.setState({ top: newTop, left: newLeft });
    }
  }

  public componentDidUpdate(): void {
    const { top: oldTop, left: oldLeft } = this.state;

    const node = ReactDOM.findDOMNode(this);

    if (node instanceof HTMLElement) {
      const rect = this.props.getRect(node);

      const newTop = rect.top + rect.height;
      const newLeft = rect.left;

      if (newTop !== oldTop || newLeft !== oldLeft) {
        this.setState({ top: newTop, left: newLeft });
      }
    }
  }

  public render() {
    let portal = null;

    if (this.props.scrollIsEnabled && this.props.visible) {
      portal = ReactDOM.createPortal(
        <div style={{
          position: "absolute",
          zIndex: 9999,
          top: this.state.top + this.props.span,
          left: this.state.left,
        }}>
          { this.props.content }
        </div>,
        document.getElementById("portal-target"),
      );
    }

    return (
      <React.Fragment>
        {this.props.reference}
        {portal}
      </React.Fragment>
    );
  }
}

export default listenToScroll(Portal);
