/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers, Reducer } from "redux";

import languageProviderReducer from "../core/LanguageProvider/reducer";

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function reducerCreatorFactory(history: History, reducers: { [key: string]: Reducer }) {
  return function createReducer(injectedReducers = {}) {
    return combineReducers({
      ...reducers,
      router: connectRouter(history),
      language: languageProviderReducer,
      ...injectedReducers,
    });
  };
}
