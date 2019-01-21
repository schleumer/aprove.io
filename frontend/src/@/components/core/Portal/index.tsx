import { getScrollLeft, getScrollParent, getScrollTop } from "@/utils";
import React from "react";
import ReactDOM from "react-dom";

interface Props {
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

  public placeIt(): void {
    const node = ReactDOM.findDOMNode(this);

    if (node instanceof HTMLElement) {
      const parent = getScrollParent(node);
      const scrollLeft = getScrollLeft(parent);
      const scrollTop = getScrollTop(parent);

      console.log(parent.getBoundingClientRect());

      const { top: oldTop, left: oldLeft } = this.state;

      const rect = node.getBoundingClientRect();
      const newLeft = rect.left + scrollLeft;
      const newTop = rect.bottom + scrollTop;

      console.log({scrollLeft, scrollTop, newTop, newLeft});

      if (newLeft !== oldLeft || newTop !== oldTop) {
        this.setState({
          top: newTop,
          left: newLeft,
        });
      }
    }
  }

  public componentDidMount(): void {
    this.placeIt();
  }

  public componentDidUpdate(): void {
    this.placeIt();
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

export default Portal;
