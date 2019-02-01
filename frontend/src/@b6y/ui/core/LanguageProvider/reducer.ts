import produce from "immer";
import { CHANGE_LOCALE } from "./constants";

const initialState = {
  locale: "pt",
};

function languageProviderReducer(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case CHANGE_LOCALE:
        draft.locale = action.locale;
    }
  });
}

export default languageProviderReducer;
