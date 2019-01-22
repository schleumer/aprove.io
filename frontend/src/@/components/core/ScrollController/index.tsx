import { Box } from "@/components/styled";
import { Box as BoxType } from "@/components/styled/types";
import styled from "@emotion/styled";
import EventEmitter from "eventemitter3";
import hoistNonReactStatic from "hoist-non-react-statics";
import R from "ramda";
import React from "react";
import ReactDOM from "react-dom";

interface ScrollContext {
  name: string;
  bus: EventEmitter;
  path: any[];
  getMyRect?(): ElementRect;
  getRect?(el: HTMLElement): ElementRect;
}

interface State {
}

interface Props extends BoxType {
  name: string;
  root: boolean;
  x: boolean;
  y: boolean;
}

interface PropsWithContext {
  ctx: ScrollContext;
}

interface ElementRect {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface InjectedScrollProps {
  containerRect: ElementRect;
  getRect(el: HTMLElement): ElementRect;
}

const StyledScrollController = styled(Box)<Props>`
position: relative;
overflow-x: ${(props) => props.x ? "auto" : "visible"};
overflow-y: ${(props) => props.y ? "auto" : "visible"};
`;

const omit = R.omit<string>(["name", "ctx"]);

export const Context = React.createContext<ScrollContext>({
  name: null,
  bus: null,
  path: [],
});

export const listenToScroll = <P, S>(
  WrappedComponent: React.ComponentType<P & { children?: React.ReactNode } & InjectedScrollProps>,
): React.ComponentClass<Pick<P, Exclude<keyof P, keyof InjectedScrollProps>>> => {
  interface ScrollEvent {
    ctx: ScrollContext;
  }

  interface ListenerProps {
    ctx: ScrollContext;
  }

  interface ListenerState {
    rect: ElementRect;
  }

  class Listener extends React.Component<P & ListenerProps, ListenerState> {
    public state = {
      rect: null,
    };

    constructor(props) {
      super(props);

      this.getRect = this.getRect.bind(this);
    }

    public componentDidMount(): void {
      this.props.ctx.bus.addListener("scroll", (event: ScrollEvent) => {
        this.updateContainerRect();
      });

      this.updateContainerRect();
    }

    public updateContainerRect() {
      const { ctx } = this.props;

      this.setState({ rect: ctx.getMyRect() });
    }

    public getRect(el: HTMLElement): ElementRect {
      const { ctx } = this.props;

      return ctx.getRect(el);
    }

    public render() {
      if (this.state.rect) {
        return <WrappedComponent getRect={this.getRect} containerRect={this.state.rect} {...this.props} />;
      } else {
        return null;
      }
    }
  }

  class Enhance extends React.Component<P, S> {
    constructor(props, context) {
      super(props, context);
    }

    public render() {
      return (
        <Context.Consumer>
          {(ctx) => <Listener ctx={ctx} {...this.props} />}
        </Context.Consumer>
      );
    }
  }

  hoistNonReactStatic(Enhance, WrappedComponent);

  return Enhance;
};

class ContextualizedScrollController extends React.Component<Props & PropsWithContext, State> {
  public containerRef = React.createRef();

  constructor(props) {
    super(props);

    this.scrolled = this.scrolled.bind(this);
    this.getMyRect = this.getMyRect.bind(this);
    this.getRect = this.getRect.bind(this);
  }

  public componentDidMount(): void {
    if (this.props.root) {
      window.addEventListener("scroll", this.scrolled);
    } else {
      const { current } = this.containerRef;
      if (current !== null && current instanceof HTMLElement) {
        current.addEventListener("scroll", this.scrolled);
      }
    }
  }

  public componentWillUnmount(): void {
    if (this.props.root) {
      window.removeEventListener("scroll", this.scrolled);
    } else {
      const { current } = this.containerRef;
      if (current !== null && current instanceof HTMLElement) {
        current.removeEventListener("scroll", this.scrolled);
      }
    }
  }

  public getRect(el: HTMLElement): ElementRect {
    const rect = el.getBoundingClientRect();

    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width,
      height: rect.height,
    };
  }

  public getMyRect(): ElementRect | null {
    if (this.props.root) {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    } else {
      const node = ReactDOM.findDOMNode(this);

      if (node instanceof HTMLElement) {
        const rect = node.getBoundingClientRect();

        return {
          left: rect.left + window.pageXOffset,
          top: rect.top + window.pageYOffset,
          width: rect.width,
          height: rect.height,
        };
      }

      return null;
    }
  }

  public scrolled(event: UIEvent) {
    const { ctx } = this.props;
    const { bus } = ctx;

    bus.emit("scroll", { ctx });
  }

  public render() {
    const safeProps = omit<Props>(this.props);

    return (
      <Context.Provider value={{
        ...this.props.ctx,
        getMyRect: this.getMyRect,
        getRect: this.getRect,
      }}>
        <StyledScrollController ref={this.containerRef} {...safeProps} />
      </Context.Provider>
    );
  }
}

class ScrollController extends React.Component<Props, State> {
  public static defaultProps = {
    x: true,
    y: true,
    root: false,
  };

  public mergeContext(x: ScrollContext): ScrollContext {
    const newContext = {
      name: this.props.name,
      bus: x.bus || new EventEmitter(),
      path: [...x.path, this],
    };

    return newContext;
  }

  public render() {
    return (
      <Context.Consumer>
        {(x) => <ContextualizedScrollController ctx={this.mergeContext(x)} {...this.props} />}
      </Context.Consumer>
    );
  }
}

export const RootScrollController = (props: Props) => {
  return <ScrollController name="root" x={true} y={true} root={true} {...props} />;
};

export default ScrollController;
