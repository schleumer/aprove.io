import React from "react";
import ReactDOM from "react-dom";
import { InjectedScrollProps, listenToScroll } from "../ScrollController";

interface Props extends InjectedScrollProps {
  onHide?: () => void;
  visible?: boolean;
  reference: React.ReactElement<any>;
  content: React.ReactNode;
  span?: number;
  left?: number;
  top?: number;
}

interface State {
  top?: number;
  left?: number;
  id?: string;
  visible?: boolean;
}

class Portal extends React.Component<Props, State> {
  public static defaultProps = {
    visible: null,
    span: 0,
  };

  public state = {
    visible: null,
    top: null,
    left: null,
    id: null,
  };

  public componentDidMount(): void {
    const node = ReactDOM.findDOMNode(this);
    if (node instanceof HTMLElement) {
      const rect = this.props.getRect(node);

      const newTop = rect.top + rect.height;
      const newLeft = rect.left;

      let visible = null;

      if (this.props.visible !== null) {
        visible = this.props.visible;
      }

      this.setState({
        top: newTop,
        left: newLeft,
        id: this.props.scrollId,
        visible,
      });
    }
  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
    return this.state.id !== nextProps.scrollId
      || this.props.visible !== nextProps.visible;
  }

  public componentDidUpdate(): void {
    const { id: oldId } = this.state;

    const node = ReactDOM.findDOMNode(this);

    if (node instanceof HTMLElement) {
      const newId = this.props.scrollId;

      if (oldId !== newId) {
        const rect = this.props.getRect(node);
        const newTop = rect.top + rect.height;
        const newLeft = rect.left;

        let visible = this.props.visible;

        if (this.props.visible === null) {
          visible = false;
        }

        this.setState({ top: newTop, left: newLeft, id: newId, visible }, () => {
          if (this.props.onHide) {
            this.props.onHide();
          }
        });
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
