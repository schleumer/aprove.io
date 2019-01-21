import { SET_VIEW, VIEW } from "./constants";

export function view({ id }) {
  return {
    type: VIEW,
    data: { id },
  };
}

export function setView(data) {
  return {
    type: SET_VIEW,
    data,
  };
}
