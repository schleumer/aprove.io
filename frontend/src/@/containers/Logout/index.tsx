import React from 'react';

import styled from '@emotion/styled';

import { compose } from 'redux';

import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import { FormattedMessage } from 'react-intl';

import * as actions from '@/root/actions';

import { makeSelectAuth } from '@/root/selectors';

import messages from './messages';

const Content = styled.div`
  padding: 50px;
  text-align: center;
`;

interface Props {
  logout: Function,
}

class LogoutPage extends React.Component<Props> {
  componentDidMount() {
    const { logout } = this.props;

    logout();
  }

  render() {
    return (
      <Content>
        <FormattedMessage {...messages.loginOut} />
      </Content>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(actions.logout()),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LogoutPage);
