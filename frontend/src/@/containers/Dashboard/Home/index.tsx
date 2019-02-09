import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { compose } from "redux";

import { Box, Flex } from "@b6y/ui/styled";
import { PageTitle } from "@/components/elite";
import { createStructuredSelector } from "reselect";

import breadcrumbMessages from "@/messages/breadcrumbs";
import { makeSelectAuth } from "@/root/selectors";
import { AuthState } from "@/root/types";
import defineBreadcrumbs from "@/utils/defineBreadcrumbs";
import injectReducer from "@b6y/ui/redux/injectReducer";
import reducer from "./reducer";

const breadcrumbs = defineBreadcrumbs({
  home: [
    {
      id: "home",
      name: breadcrumbMessages.home,
      path: "/",
    },
  ],
});

interface IProps {
  auth: AuthState;
}

export class HomePage extends React.PureComponent<IProps> {
  public render() {
    return (
      <div>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        <div>
          <PageTitle title="Dashboard" breadcrumb={breadcrumbs.home} />
          <Flex>
            <Box width={1} style={{ backgroundColor: "white" }} p={3}>
              AAAAAAAAa
            </Box>
          </Flex>
        </div>
      </div>
    );
  }
}

export function mapDispatchToProps() {
  return {};
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: "home", reducer });

export default compose(
  withReducer,
  withConnect,
)(HomePage);
