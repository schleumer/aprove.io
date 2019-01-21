/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import produce from "immer";

import {
  AUTHENTICATE,
  AUTHENTICATE_ERRORS,
  AUTHENTICATED,
  RESET_STATE,
  SET_TOKEN,
} from "./constants";

import { State } from "./types";

// The initial state of the App
const initialState: State = {
  loading: false,
  error: false,
  auth: {
    errors: [],
    token: null,
    user: null,
    submitting: false,
  },
};

function appReducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case AUTHENTICATE:
        draft.auth.submitting = true;
        break;
      case SET_TOKEN:
        draft.auth.token = action.data;
        break;
      case AUTHENTICATED:
        draft.auth.submitting = false;
        draft.auth.errors = [];
        draft.auth.user = action.data.user;
        draft.auth.token = action.data.token;
        break;
      case AUTHENTICATE_ERRORS:
        draft.auth.submitting = false;
        draft.auth.errors = action.data;
        break;
      case RESET_STATE:
        return initialState;
    }
  });
}

export default appReducer;
