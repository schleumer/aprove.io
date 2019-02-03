import { History } from "history";
import { AnyAction, Reducer, Store } from "redux";

import configureStore from "./redux/configureStore";
import Theme from "./types/theme";

export interface Definition {
  reducerCreator?: (injectedReducers: any) => Reducer<any, AnyAction>;
  messages?: any;
  reducers?: { [key: string]: Reducer };
  history?: History;
  store?: Store;
  theme?: (defaultTheme: Theme) => Theme;
}

export const initialState = {};

const storeFactory = (history, reducers) => configureStore(initialState, history, reducers);

const mergeWithDefaultDefinition = (definition: Definition): Definition => {
  const history = definition.history;
  const messages =  {...definition.messages};
  const store = storeFactory(history, definition.reducers || {});

  return {
    history,
    store,
    messages,
    theme(defaultTheme: Theme): Theme {
      return defaultTheme;
    },
  };
};

export default function createApplicationDefinition(definition: Definition): Definition {
  return mergeWithDefaultDefinition(definition);
}
