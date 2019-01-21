import hoistNonReactStatics from "hoist-non-react-statics";
import PropTypes from "prop-types";
import React from "react";

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
    public static WrappedComponent = WrappedComponent;

    public static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    public static displayName = `withReducer(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component"})`;

    public injectors = getInjectors(this.context.store);

    public componentWillMount() {
      const { injectReducer } = this.injectors;

      injectReducer(key, reducer);
    }

    public render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};
