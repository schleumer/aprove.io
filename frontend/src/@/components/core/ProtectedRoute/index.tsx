import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectAuth } from '@/root/selectors';

interface Props extends RouteProps {
  auth: {
    user: any;
  };
  permission?: any;
}

class PrivateRoute extends React.Component<Props> {
  render () {
    const { component: Component, permission, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          rest.auth.user ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          )
        }
      />
    )
  }
}

export default connect(
  createStructuredSelector({
    auth: makeSelectAuth(),
  }),
)(PrivateRoute);
