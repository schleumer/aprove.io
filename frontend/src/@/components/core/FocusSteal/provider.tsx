import EventEmitter from "eventemitter3";
import React from "react";

import { FocusStealEvent } from "./types";

import Context from "./context";

export default class FocusStealProvider extends React.Component {
  public bus = new EventEmitter();

  public componentDidMount() {
    window.addEventListener("click", (evt) => {
      this.bus.emit("stolen", { target: evt.target } as FocusStealEvent);
    });

    window.addEventListener("focusin", (evt) => {
      this.bus.emit("stolen", { target: evt.target } as FocusStealEvent);
    });
  }

  public render() {
    return (
      <Context.Provider value={{ bus: this.bus }} {...this.props} />
    );
  }
}
