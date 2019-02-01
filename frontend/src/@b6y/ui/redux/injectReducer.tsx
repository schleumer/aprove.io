import hoistNonReactStatics from "hoist-non-react-statics";
import React from "react";
import { ReactReduxContext } from "react-redux";

import getInjectors from "./reducerInjectors";

/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
export default ({ key, reducer }) => (WrappedComponent) => {
  class ReducerInjector extends React.Component {

    public static displayName = `withReducer(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;
    constructor(props, context) {
      super(props, context);

      getInjectors(props.reduxContext.store)
        .injectReducer(key, reducer);
    }

    public render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  class ReducerInjectorConsumer extends React.Component {
    public static WrappedComponent = WrappedComponent;

    public static displayName = `withReducerConsumers(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    public render() {
      return (
        <ReactReduxContext.Consumer>
          {(x) => <ReducerInjector reduxContext={x} {...this.props}/>}
        </ReactReduxContext.Consumer>
      );
    }
  }

  return hoistNonReactStatics(ReducerInjectorConsumer, WrappedComponent);
};
