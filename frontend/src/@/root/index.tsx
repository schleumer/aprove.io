import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import { Helmet } from "react-helmet";
import { Route, Switch, withRouter } from "react-router-dom";

import injectSaga from "@/utils/injectSaga";

import styled from "@emotion/styled";

import KitchenSink from "@/containers/KitchenSink/Loadable";
import Login from "@/containers/Login/Loadable";
import Logout from "@/containers/Logout/Loadable";
import NotFound from "@/containers/NotFound/Loadable";

import { Box, Container, Flex, ProtectedRoute } from "@b6y/ui/core";

import { Root as Dashboard } from "@/containers/Dashboard";

import { makeSelectAuth, makeSelectLoading } from "@/root/selectors";

import Loading from "@b6y/ui/core/Loading";
import { RootScrollController } from "@b6y/ui/core/ScrollController";

import * as actions from "./actions";
import saga from "./saga";

const AppWrapper = styled.div``;

interface IProps {
  reauthenticate: typeof actions.reauthenticate;
  goToLogin: typeof actions.goToLogin;
  auth: {
    user: any,
  };
  location: {
    pathname: string,
  };
}

const KitchenSinkWrapper = (props) => {
  return (
    <Box m={3}>
      <KitchenSink {...props} />
    </Box>
  );
};

class App extends React.PureComponent<IProps> {
  public componentDidMount() {
    const {
      reauthenticate,
      goToLogin,
      auth: { user },
      location: { pathname },
    } = this.props;

    if (user === null) {
      const raw = localStorage.getItem("aprove-io:auth");

      if (raw) {
        reauthenticate(JSON.parse(raw), pathname);
      } else {
        goToLogin(pathname);
      }
    }
  }

  public render() {
    return (
      <RootScrollController>
        <AppWrapper>
          <Helmet
            titleTemplate="%s - Helmet da massa"
            defaultTitle="Helmet da massa"
          >
            <meta name="description" content="Helmet da massa" />
          </Helmet>
          <Container>
            <Loading name="global">
              {() => (
                <Flex>
                  <Box width={1}>
                    <Switch>
                      <Route path="/public-kitchen-sink" component={KitchenSinkWrapper} />
                      <Route exact path="/logout" component={Logout} />
                      <Route exact path="/login" component={Login} />
                      <ProtectedRoute path="/" component={Dashboard} />
                      <Route component={NotFound} />
                    </Switch>
                  </Box>
                </Flex>
              )}
            </Loading>
          </Container>
        </AppWrapper>
      </RootScrollController>
    );
  }
}

const withSaga = injectSaga({ key: "home", saga });

export function mapDispatchToProps(dispatch) {
  return {
    goToLogin: (from) => dispatch(actions.goToLogin(from)),
    persistAuthenticate: (data) => dispatch(actions.persistAuthenticate(data)),
    reauthenticate: (data, from) =>
      dispatch(actions.reauthenticate(data, from)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  loading: makeSelectLoading(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  withSaga,
)(App);
