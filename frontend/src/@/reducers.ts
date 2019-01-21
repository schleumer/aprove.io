/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";

import languageProviderReducer from "@/containers/LanguageProvider/reducer";
import history from "@/history";
import pendingRequests from "@/reducers/pendingRequests";
import globalReducer from "@/root/reducer";

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    language: languageProviderReducer,
    pendingRequests,
    ...injectedReducers,
  });
}
