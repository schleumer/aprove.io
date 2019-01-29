import invariant from "invariant";
// TODO: remove lodash in favor of `ramda`
import { conformsTo, isFunction, isObject } from "lodash";

/**
 * Validate the shape of redux store
 */
export default function checkStore(store) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
  };
  invariant(
    conformsTo(store, shape),
    "(@b6y/commons/checkStore...) injectors: Expected a valid redux store",
  );
}
