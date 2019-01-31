import React from "react";

import styled from "@emotion/styled";

import NotFound from "@/containers/NotFound/Loadable";

import { Box, Flex } from "@b6y/ui/styled";

import { RouterLink } from "@b6y/ui/router";

import { getSpace } from "@b6y/ui/styled/system";

import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import { theme } from "styled-tools";

import { makeSelectAuth } from "@/root/selectors";
import injectReducer from "@/utils/injectReducer";

import Icon from "@b6y/ui/core/Icon";
import Tooltip from "@b6y/ui/core/Tooltip";

import reducer from "./reducer";

import Home from "../Home";

import Customers from "../Customers/Loadable";

import KitchenSink from "../../KitchenSink";

import messages from "./messages";

const SignOutTooltip = () => <FormattedMessage {...messages.signOut} />;

const LightNavLink = styled(RouterLink)`
  font-weight: 400;
  height: 50px;
  display: flex;
  align-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  color: white;
  text-decoration: none;
`;

const LeftBarLink = styled(RouterLink)((props) => ({
  "textDecoration": "none",
  "color": theme("colors.grayer")(props),
  "fontSize": "14px",
  "padding": 8,
  "width": "100%",
  "display": "flex",
  "alignItems": "center",
  "& > span": {
    marginLeft: "15px",
  },
  "&.__active": {
    color: theme("defaults.bg.primary")(props),
  },
  "marginBottom": "15px",
}));

const ContentWrapper = styled(Flex)`
  width: 100%;
  top: 58px;
  left: 0;
  bottom: 0;
  right: 0;
  margin-top: 58px;
`;

const LeftBar = styled(Box)((props) => ({
  width: "250px",
  padding: "15px",
  backgroundColor: theme("colors.darker")(props),
  color: theme("colors.grayer")(props),
  overflowY: "auto",
  position: "fixed",
  top: "58px",
  bottom: 0,
}));

const RightBar = styled(Box)((props) => ({
  width: "100%",
  padding: getSpace(3)(props),
  paddingBottom: "150px",
  marginLeft: "250px",
}));

const Dashboard = (props) => {
  const {
    auth: { user },
  } = props;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "fixed", right: 0, left: 0, top: 0, zIndex: 99 }}>
        <Box bg="green" color="white" p={1}>
          <Flex>
            <Box px={2}>
              <LightNavLink to="/">
                <Icon size={25} name="usd-square" />
              </LightNavLink>
            </Box>
            {/*
            <LightNavLink to="/instances">
              <FormattedMessage id="instances.title" />
            </LightNavLink>
            <LightNavLink to="/users">
              <FormattedMessage {...messages.users} />
            </LightNavLink>
            */}

            <Flex ml="auto" alignItems="center">
              <Box>{user.name}</Box>
              <Box>
                <LightNavLink to="/logout">
                  <Tooltip text={<SignOutTooltip />} position="bottom">
                    <Icon name="sign-out" style={{ marginRight: 5 }} />
                  </Tooltip>
                </LightNavLink>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </div>
      <ContentWrapper>
        <LeftBar>
          <LeftBarLink to="/" exact>
            <Icon name="tachometer" />
            <span>Dashboard</span>
          </LeftBarLink>
          <LeftBarLink to="/customers">
            <Icon name="user" />
            <span>Clientes</span>
          </LeftBarLink>
          <LeftBarLink to="/proposals">
            <Icon name="file" />
            <span>Propostas</span>
          </LeftBarLink>
          <LeftBarLink to="/items/tours">
            <Icon name="shopping-bag" />
            <span>Tours</span>
          </LeftBarLink>
          <LeftBarLink to="/settings">
            <Icon name="cog" />
            <span>Configurações</span>
          </LeftBarLink>
          {process.env.NODE_ENV === "development" && (
            <LeftBarLink to="/dashboard-kitchen-sink">
              <Icon name="cog" />
              <span>Componentes</span>
            </LeftBarLink>
          )}
        </LeftBar>
        <RightBar width={1} px={3} py={3}>
          <Switch>
            <Route path="/customers" component={Customers} />
            <Route path="/dashboard-kitchen-sink" component={KitchenSink} />
            {/*<Route path="/instances" component={Instances} />*/}
            {/*<Route path="/users" component={Users} />*/}
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </RightBar>
      </ContentWrapper>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
    }),
  }),
};

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

const withReducer = injectReducer({ key: "dashboard", reducer });

export default compose(
  withReducer,
  withConnect,
)(Dashboard);
