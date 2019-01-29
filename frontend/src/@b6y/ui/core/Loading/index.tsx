import React from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import LoadingIndicator from "../../core/LoadingIndicator";
import injectReducer from "../../utils/injectReducer";
import * as actions from "./actions";
import reducer from "./reducer";

const Loading = (props) => {
  const { loading, name, children } = props;

  let state = loading[name];

  if (state === undefined) {
    state = true;
  }

  if (state) {
    return <LoadingIndicator />;
  }

  return children();
};

Loading.propTypes = {
  name: PropTypes.string,
  children: PropTypes.func,
};

const withReducer = injectReducer({ key: "@b6y/components/core/Loading", reducer });

export function mapDispatchToProps(dispatch) {
  return {
    setState: (name, state) => dispatch(actions.setState(name, state)),
  };
}

const mapStateToProps = (state) => {
  return ({
    loading: state["@b6y/components/core/Loading"] || {},
  });
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withConnect,
)(Loading);
