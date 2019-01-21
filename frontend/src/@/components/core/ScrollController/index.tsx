import R from "ramda";
import React from "react";
import EventEmitter from "eventemitter3";
import hoistNonReactStatic from "hoist-non-react-statics";

import { Box } from "@/components/styled";
import { Box as BoxType } from "@/components/styled/types";
import styled from "@emotion/styled";

interface State {
}

interface Props extends BoxType {
  name: string;
  x?: boolean;
  y?: boolean;
}

interface ElementRect {}

export interface InjectedScrollProps {
  getRect(el: HTMLElement): ElementRect;
}

const StyledScrollController = styled(Box)<Props>`
position: relative;
overflow-x: ${(props) => props.x ? "auto" : "visible"};
overflow-y: ${(props) => props.y ? "auto" : "visible"};
`;

const omit = R.omit<string>(["name"]);

interface ScrollContext {
  bus: EventEmitter;
  parents: any[];
}

export const Context = React.createContext<ScrollContext>({
  bus: null,
  parents: [],
});

export const listenToScroll = <P, S>(
  WrappedComponent: React.ComponentType<P & { children?: React.ReactNode } & InjectedScrollProps>,
) => {
  class Enhance extends React.Component<P, S> {
    constructor(props, context) {
      super(props, context);
    }

    public getRect(ctx: ScrollContext) {
      return (el: HTMLElement): ElementRect => {
        return null;
      };
    }

    public render() {
      return (
        <Context.Consumer>
          {(ctx) => <WrappedComponent getRect={this.getRect(ctx)} {...this.props} />}
        </Context.Consumer>
      );
    }
  }

  hoistNonReactStatic(Enhance, WrappedComponent);

  return Enhance;
};

export default class ScrollController extends React.Component<Props, State> {
  public containerRef = React.createRef();

  constructor(props) {
    super(props);

    this.scrolled = this.scrolled.bind(this);
  }

  public componentDidMount(): void {
    const { current } = this.containerRef;

    if (current !== null && current instanceof HTMLElement) {
      current.addEventListener("scroll", this.scrolled);
    }
  }

  public componentWillUnmount(): void {
    const { current } = this.containerRef;

    console.log("unmonted", current);

    if (current !== null && current instanceof HTMLElement) {
      current.removeEventListener("scroll", this.scrolled);
    }
  }

  public scrolled(evt: UIEvent) {
    console.log(this, evt);
  }

  public mergeContext(x: ScrollContext): ScrollContext {
    const newContext = {
      bus: x.bus || new EventEmitter(),
      parents: [...x.parents, this],
    };

    console.log(newContext, this.props);

    return newContext
  }

  public render() {
    const safeProps = omit<Props>(this.props);

    return (
      <Context.Consumer>
        {(x) => {
          return (
            <Context.Provider value={this.mergeContext(x)}>
              <StyledScrollController ref={this.containerRef} {...safeProps} />
            </Context.Provider>
          );
        }}
      </Context.Consumer>
    );
  }
}
