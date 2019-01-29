import { SET_STATE } from "./constants";

// The initial state of the App
const initialState = {};

function loadingComponentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STATE:
      return {
        ...state,
        [action.data.name]: action.data.state,
      };
    default:
      return state;
  }
}

export default loadingComponentReducer;
