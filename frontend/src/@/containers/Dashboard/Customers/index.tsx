import React from "react";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { compose } from "redux";
import {
  createStructuredSelector,
} from "reselect";

import { makeSelectAuth } from "@/root/selectors";

import InstancesList from "./list";
import InstancesView from "./view";

import messages from "./messages";

const Home = ({ match, globalState }) => (
  <div>
    <FormattedMessage {...messages.title}>
      {(t) => (
        <Helmet>
          <title>{t}</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
      )}
    </FormattedMessage>
    <div>
      <Switch>
        <Route path={`${match.path}/:customerId`} component={InstancesView} />
        <Route path={`${match.path}`} exact component={InstancesList} />
      </Switch>
    </div>
  </div>
);

Home.propTypes = {
  // auth: PropTypes.shape({
  //   user: PropTypes.shape({
  //     name: PropTypes.string,
  //     id: PropTypes.number,
  //   }),
  // }),
};

export function mapDispatchToProps() {
  return {};
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  globalState: (state) => state,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(Home);
