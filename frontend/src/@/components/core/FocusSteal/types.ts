import { Box as BoxType } from "@/components/styled/types";
import EventEmitter from "eventemitter3";

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
