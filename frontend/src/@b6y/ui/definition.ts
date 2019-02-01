import { History } from "history";
import { AnyAction, Reducer, Store } from "redux";

import historyFactory from "./historyFactory";
import configureStore from "./redux/configureStore";
import reducerCreatorFactory from "./redux/reducerCreatorFactory";
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

const storeFactory = (reducerCreator, history) => configureStore(reducerCreator, initialState, history);

const mergeWithDefaultDefinition = (definition: Definition): Definition => {
  const messages =  {...definition.messages};
  const history = historyFactory();
  const reducerCreator = reducerCreatorFactory(history, definition.reducers || {});
  const store = storeFactory(reducerCreator, history);

  return {
    reducerCreator,
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
