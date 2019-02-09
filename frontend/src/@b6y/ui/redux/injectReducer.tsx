import hoistNonReactStatics from "hoist-non-react-statics";
import React from "react";
import { ReactReduxContext } from "react-redux";
import { Context } from "../core/ScrollController";

import getInjectors from "./reducerInjectors";

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
export default ({ key, reducer }) => (WrappedComponent) => {
  class ReducerInjector extends React.PureComponent {
    public static WrappedComponent = WrappedComponent;

    public static contextType = ReactReduxContext;

    public static displayName = `withReducer(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    public context!: React.ContextType<typeof Context>;

    constructor(props, context) {
      super(props, context);

      getInjectors(context.store)
        .injectReducer(key, reducer);
    }

    public render() {
      return <WrappedComponent {...this.props}/>;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};
