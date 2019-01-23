import React from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import injectReducer from "@/utils/injectReducer";

import * as actions from "./actions";

import reducer from "./reducer";

import LoadingIndicator from "@/components/core/LoadingIndicator";

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

const withReducer = injectReducer({ key: "@/components/Loading", reducer });

export function mapDispatchToProps(dispatch) {
  return {
    setState: (name, state) => dispatch(actions.setState(name, state)),
  };
}

const mapStateToProps = (state) => {
  return ({
    loading: state["@/components/Loading"] || {},
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
