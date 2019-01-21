import { DEFAULT_LOCALE } from "@/root/constants";

import produce from "immer";
import { CHANGE_LOCALE } from "./constants";

const initialState = {
  locale: DEFAULT_LOCALE,
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
