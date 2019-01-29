import { SET_STATE } from "./constants";

export function setState(name, state) {
  return {
    type: SET_STATE,
    data: { name, state },
  };
}
