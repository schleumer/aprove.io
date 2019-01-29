import styled from "@emotion/styled";
import EventEmitter from "eventemitter3";
import hoistNonReactStatic from "hoist-non-react-statics";
import { debounce } from "lodash";
import nanoid from "nanoid";
import R from "ramda";
import React from "react";
import ReactDOM from "react-dom";
import ReactResizeDetector from "react-resize-detector";

import { Box } from "../../styled";
import { Box as BoxType } from "../../styled/types";

interface ScrollContext {
  enabled: boolean;
  name: string;
  bus: EventEmitter;
  path: any[];
  getMyInfo?(): ScrollContainerInfo;
  getRect?(el: HTMLElement): ElementRect;
}

interface ScrollEvent {
  ctx: ScrollContext;
}

interface State {
}

interface Props extends BoxType {
  enabled: boolean;
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

interface ScrollContainerInfo extends ElementRect {
  scrollTop: number;
  scrollLeft: number;
}

interface ListenerProps {
  forwardedRef: React.Ref<any>;
}

interface ListenerState {
  id: string;
  rect: ElementRect;
}

export interface InjectedScrollProps {
  scrollId: string;
  scrollIsEnabled: boolean;
  containerRect: ElementRect;
  getRect(el: HTMLElement): ElementRect;
}

const StyledScrollController = styled(Box)<Props>`
position: relative;
overflow-x: ${(props) => props.x ? "auto" : "visible"};
overflow-y: ${(props) => props.y ? "auto" : "visible"};
`;

const omit = R.omit<string>(["name", "x", "y", "ctx", "children"]);

export const Context = React.createContext<ScrollContext>({
  enabled: true,
  name: null,
  bus: null,
  path: [],
});

export const listenToScroll = <P, S>(
  WrappedComponent: React.ComponentType<P & { children?: React.ReactNode } & InjectedScrollProps>,
): React.ComponentClass<Pick<P, Exclude<keyof P, keyof InjectedScrollProps>>> => {
  class Listener extends React.Component<P & ListenerProps, ListenerState> {
    public static contextType = Context;

    public context!: React.ContextType<typeof Context>;

    public state = {
      rect: null,
      id: null,
    };

    constructor(props) {
      super(props);

      this.getRect = this.getRect.bind(this);
      this.scrolled = this.scrolled.bind(this);
    }

    public scrolled(event: ScrollEvent) {
      this.updateContainerRect();
    }

    public componentDidMount(): void {
      this.context.bus.addListener("scroll", this.scrolled);

      this.updateContainerRect();
    }

    public componentWillUnmount(): void {
      this.context.bus.removeListener("scroll", this.scrolled);
    }

    public updateContainerRect() {
      const ctx = this.context;

      if (!ctx.enabled) {
        return;
      }

      const rect = ctx.getMyInfo();

      // tslint:disable-next-line:max-line-length
      const id = `${nanoid()}-${rect.left}x${rect.top}:${rect.width}x${rect.height}:${rect.scrollLeft}x${rect.scrollTop}`;

      this.setState({ rect, id });
    }

    public getRect(el: HTMLElement): ElementRect {
      return this.context.getRect(el);
    }

    public render() {
      const ctx = this.context;

      if (this.state.rect) {
        return (
          <WrappedComponent
            ref={this.props.forwardedRef}
            containerRect={this.state.rect}
            scrollId={this.state.id}
            scrollIsEnabled={ctx.enabled}
            getRect={this.getRect}
            {...this.props}
          />
        );
      } else {
        return null;
      }
    }
  }

  const Enhance = React.forwardRef((props: P, ref) => {
    return <Listener forwardedRef={ref} {...props} />;
  });

  return hoistNonReactStatic(Enhance, WrappedComponent);
};

class ContextualizedScrollController extends React.Component<Props & PropsWithContext, State> {
  public containerRef = React.createRef();

  constructor(props) {
    super(props);

    this.scrolled = debounce(this.scrolled.bind(this), 50);
    this.resized = this.resized.bind(this);
    this.getMyInfo = this.getMyInfo.bind(this);
    this.getRect = this.getRect.bind(this);
  }

  public componentDidMount(): void {
    this.attach();
  }

  public componentWillUnmount(): void {
    this.detach();
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

  public getMyInfo(): ScrollContainerInfo | null {
    if (this.props.root) {
      return {
        scrollTop: window.scrollY,
        scrollLeft: window.scrollX,
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
          scrollTop: node.scrollTop,
          scrollLeft: node.scrollLeft,
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

  public resized() {
    const { ctx } = this.props;
    const { bus } = ctx;

    bus.emit("scroll", { ctx });
  }

  public render() {
    const safeProps = omit<Props>(this.props);

    return (
      <Context.Provider value={{
        ...this.props.ctx,
        getMyInfo: this.getMyInfo,
        getRect: this.getRect,
      }}>
        <StyledScrollController ref={this.containerRef} {...safeProps}>
          {this.props.children}
          <ReactResizeDetector handleWidth handleHeight onResize={this.resized} />
        </StyledScrollController>
      </Context.Provider>
    );
  }

  private attach(): void {
    if (this.props.root) {
      window.addEventListener("scroll", this.scrolled);
      window.addEventListener("resize", this.scrolled);
    } else {
      const { current } = this.containerRef;
      if (current !== null && current instanceof HTMLElement) {
        current.addEventListener("scroll", this.scrolled);
      }
    }
  }

  private detach(): void {
    if (this.props.root) {
      window.removeEventListener("scroll", this.scrolled);
      window.removeEventListener("resize", this.scrolled);
    } else {
      const { current } = this.containerRef;
      if (current !== null && current instanceof HTMLElement) {
        current.removeEventListener("scroll", this.scrolled);
      }
    }
  }
}

class ScrollController extends React.Component<Props, State> {
  public static defaultProps = {
    enabled: true,
    x: true,
    y: true,
    root: false,
  };

  public mergeContext(x: ScrollContext): ScrollContext {
    return {
      name: this.props.name,
      bus: x.bus || new EventEmitter(),
      path: [...x.path, this],
      enabled: this.props.enabled,
    };
  }

  public render() {
    return (
      <Context.Consumer>
        {(x) => <ContextualizedScrollController ctx={this.mergeContext(x)} {...this.props} />}
      </Context.Consumer>
    );
  }
}

interface RootProps {}

export class RootScrollController extends React.Component<RootProps> {
  public render() {
    return <ScrollController name="root" x={true} y={true} root={true} {...this.props} />;
  }
}

export default ScrollController;
