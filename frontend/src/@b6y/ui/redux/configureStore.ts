/**
 * Create the store with dynamic reducers
 */

import { routerMiddleware } from "connected-react-router";
import { applyMiddleware, compose, createStore, Reducer } from "redux";
import createSagaMiddleware from "redux-saga";
import reducerCreatorFactory from "./reducerCreatorFactory";

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history, reducers: { [key: string]: Reducer }) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [sagaMiddleware, routerMiddleware(history)];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          latency: 0,
        })
      : compose;
  /* eslint-enable */

  const rootReducerCreator = reducerCreatorFactory(history, reducers);

  const store: any = createStore(
    rootReducerCreator(),
    initialState,
    composeEnhancers(...enhancers),
  );

  // Extensions
  store.history = history;
  store.reducers = reducers;
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry
  store.mergeReducers = (newReducers) => {
    const rootReducerCreator = reducerCreatorFactory(history, reducers);

    store.injectedReducers = {...store.injectedReducers, ...newReducers};

    store.replaceReducer(rootReducerCreator(store.injectedReducers));
  };

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept("./reducers", () => {
      const rootReducerCreator = reducerCreatorFactory(history, reducers);

      store.replaceReducer(rootReducerCreator(store.injectedReducers));
    });
  }

  return store;
}
