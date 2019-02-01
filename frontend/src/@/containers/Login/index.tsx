import React from "react";

import styled from "@emotion/styled";

import { compose } from "redux";

import { connect } from "react-redux";

import { createStructuredSelector } from "reselect";

import * as actions from "@/root/actions";

import { makeSelectAuth } from "@/root/selectors";
import { AuthState } from "@/root/types";

import { Button, Label } from "@b6y/ui/core";
import { Box, Flex } from "@b6y/ui/styled";

import { FastField, Form, Formik } from "formik";

import * as yup from "yup";

import { ErrorBag, TextInput } from "@b6y/ui/formik";

import loginBg from "@/images/bg.jpg";

import { defineMessages, FormattedMessage } from "react-intl";

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const PageWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const messages = defineMessages({
  loginHeader: { id: "login.header", defaultMessage: "Autentique-se" },
  username: { id: "login.username", defaultMessage: "Login" },
  password: { id: "login.password", defaultMessage: "Senha" },
  signIn: { id: "login.signIn", defaultMessage: "Entre" },
});

const LoginForm = ({ auth, isSubmitting, errors }) => (
  <Form>
    <Flex justifyContent="center" mt={5}>
      <Box
        p={3}
        borderRadius={2}
        bg="light"
        borderColor="blue"
        border={1}
        width={1 / 3}
        mb={3}
      >
        <Box mb={3}>
          <FormattedMessage {...messages.loginHeader} />
        </Box>
        <div>
          <ErrorBag mb={3} />
          {/* {auth.errors && (
              <Box p={0} pb={0} mb={3} color="red">
                {JSON.stringify(auth.errors)}
              </Box>
            )} */}
          <Box mb={3}>
            <Label>
              <FormattedMessage {...messages.username} />
            </Label>
            <FastField name="username" component={TextInput} />
            <ErrorBag field="username" />
          </Box>
          <Box mb={3}>
            <Label>
              <FormattedMessage {...messages.password} />
            </Label>
            <FastField name="password" type="password" component={TextInput} />
            <ErrorBag field="password" />
          </Box>
        </div>
        <div style={{ textAlign: "right" }}>
          <Button state="primary" disabled={isSubmitting} type="submit">
            <FormattedMessage {...messages.signIn} />
          </Button>
        </div>
      </Box>
    </Flex>
  </Form>
);

interface IProps {
  authenticate: (...args: any[]) => void;
  auth: AuthState;
}

class LoginPage extends React.Component<IProps> {
  public form?: React.RefObject<any>;

  constructor(a, b) {
    super(a, b);

    this.submit = this.submit.bind(this);
    this.form = React.createRef();
  }

  public submit(data) {
    const { authenticate } = this.props;

    authenticate(data);
  }

  public componentWillReceiveProps(newProps) {
    if (this.form.current) {
      this.form.current.setSubmitting(newProps.auth.submitting);
      if (!newProps.auth.submitting) {
        this.form.current.setErrors(
          newProps.auth.errors.reduce((obj, err) => {
            if (err.key in obj) {
              return { ...obj, [err.key]: `${obj[err.key]}, ${err.message}` };
            }

            return { ...obj, [err.key]: err.message };
          }, {}),
        );
      }
    }
  }

  public render() {
    const { auth } = this.props;

    return (
      <PageWrapper style={{ backgroundImage: `url(${loginBg})` }}>
        <Formik
          ref={this.form}
          validationSchema={validationSchema}
          initialValues={{
            username: "user1@aprove",
            password: "123456",
          }}
          onSubmit={this.submit}
          render={(props) => <LoginForm {...props} auth={auth} />}
        />
      </PageWrapper>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    authenticate: (f) => dispatch(actions.authenticate(f)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LoginPage);
