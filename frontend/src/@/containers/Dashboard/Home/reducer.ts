/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import produce from 'immer';
import { CHANGE_USERNAME } from './constants';

// The initial state of the App
const initialState = {
  username: '',
};

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      return produce(x => {
        x.username = action.name.replace(/@/gi, '');
      })(state);
    default:
      return state;
  }
}

export default homeReducer;
