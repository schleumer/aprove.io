import React from "react";

import Context from "./context";

import { FocusStealEvent, Props, State } from "./types";

class FocusStealConsumer extends React.Component<Props, State> {
  public static contextType = Context;

  public static defaultProps = {
    enabled: true,
  };

  public context!: React.ContextType<typeof Context>;

  constructor(props) {
    super(props);

    this.stolen = this.stolen.bind(this);
  }

  public stolen(event: FocusStealEvent) {
    if (this.props.enabled && this.props.onSteal) {
      this.props.onSteal(event);
    }
  }

  public componentDidMount() {
    this.context.bus.addListener("stolen", this.stolen);
  }

  public componentWillUnmount() {
    this.context.bus.removeListener("stolen", this.stolen);
  }

  public render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

export default FocusStealConsumer;
