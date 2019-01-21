import produce from 'immer';

import { SET_VIEW } from './constants';

// The initial state of the App
const initialState = {
  view: null,
};

function instancesReducer(state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case SET_VIEW:
        draft.view = action.data;
    }
  });
}

export default instancesReducer;
