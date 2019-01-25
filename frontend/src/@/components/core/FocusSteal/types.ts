import { Box as BoxType } from "@/components/styled/types";
import EventEmitter from "eventemitter3";

export interface State {
}

export interface Props extends BoxType {
  onSteal: (evt: FocusStealEvent) => void;
}

export interface FocusStealEvent {
  target: HTMLElement;
}

export interface PropsWithContext {
  ctx: FocusStealContext;
}

export interface FocusStealContext {
  bus: EventEmitter;
}
