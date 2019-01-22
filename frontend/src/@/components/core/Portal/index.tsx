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
      const rect = this.props.getRect(node);

      this.setState({ top: rect.top, left: rect.left });
    }
  }

  public componentDidUpdate(): void {
    const { top, left } = this.state;

    const node = ReactDOM.findDOMNode(this);

    if (node instanceof HTMLElement) {
      const rect = this.props.getRect(node);

      if (rect.top !== top || rect.left !== left) {
        this.setState({ top: rect.top, left: rect.left });
      }
    }
  }

  public render() {
    const portal = ReactDOM.createPortal(
      <div style={{ position: "absolute", zIndex: 9999, top: this.state.top + this.props.span, left: this.state.left }}>
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
