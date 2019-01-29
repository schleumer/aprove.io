import EventEmitter from "eventemitter3";

import { Box as BoxType } from "../../styled/types";

export interface State {
}

export interface Props extends BoxType {
  enabled?: boolean;
  onSteal: (evt: FocusStealEvent) => void;
}

export interface FocusStealEvent {
  type: "mousedown" | "focusin";
  target: HTMLElement;
}

export interface PropsWithContext {
  ctx: FocusStealContext;
}

export interface FocusStealContext {
  bus: EventEmitter;
}
