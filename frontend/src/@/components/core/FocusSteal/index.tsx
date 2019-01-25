import R from "ramda";
import React from "react";

import Context from "./context";

import { FocusStealEvent, Props, PropsWithContext, State } from "./types";

const omit = R.omit<string>(["ctx"]);

class ContextualizedStealFocusController extends React.Component<Props & PropsWithContext, State> {
  public containerRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props) {
    super(props);

    this.stolen = this.stolen.bind(this);
  }

  public stolen(event: FocusStealEvent) {
    console.log(event);
  }

  public componentDidMount() {
    this.props.ctx.bus.addListener("stolen", this.stolen);
  }

  public componentWillUnmount() {
    this.props.ctx.bus.removeListener("stolen", this.stolen);
  }

  public render() {
    const safeProps = omit<Props>(this.props);

    return (
      <div ref={this.containerRef} {...safeProps} />
    );
  }
}

class FocusStealConsumer extends React.Component<Props, State> {
  public static defaultProps = {
    onSteal: (evt: FocusStealEvent) => null,
  };

  public render() {
    return (
      <Context.Consumer>
        {(x) => <ContextualizedStealFocusController ctx={x} {...this.props} />}
      </Context.Consumer>
    );
  }
}

export default FocusStealConsumer;
