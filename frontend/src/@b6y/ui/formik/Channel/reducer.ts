import produce from "immer";
import { IS_SUBMITTING, REGISTER } from "./constants";

// The initial state of the App
const initialState = {};
const defaultChannelState = () => ({
  isSubmitting: false,
});

function formikChannelComponentReducer(state = initialState, action) {
  return produce(state, (draft) => {
    const { data } = action;

    switch (action.type) {
      case REGISTER:
        draft[data] = defaultChannelState();
        return;
      case IS_SUBMITTING:
        draft[data.name].isSubmitting = data.state;
        return;
      default:
        return state;
    }
  });
}

export default formikChannelComponentReducer;
