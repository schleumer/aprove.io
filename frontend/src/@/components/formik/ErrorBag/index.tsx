import styled from "@emotion/styled";
import { connect as formikConnect, FormikContext } from "formik";
import React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";

import { Box } from "@/components/styled";
import * as types from "@/components/styled/types";
import errorMessages from "@/messages/errors";

interface Props extends types.Box, InjectedIntlProps {
  field?: string;
}

interface State {}

class ErrorBagBase extends React.PureComponent<Props & { formik: FormikContext<any> }, State> {
  public static defaultProps = {
    field: "$",
  };

  public static cache = {};

  public render() {
    const { formik, field, children, ...props } = this.props;

    if (formik.errors && formik.errors[field]) {
      const originalError = formik.errors[field];
      let error = originalError;

      if (typeof originalError === "string") {
        if (ErrorBagBase.cache[originalError]) {
          error = ErrorBagBase.cache[originalError];
        } else {

          if (typeof error === "string" && error.startsWith("#")) {
            const errorKey = error.slice(1);

            if (errorMessages.hasOwnProperty(errorKey)) {
              error = this.props.intl.formatMessage(errorMessages[errorKey]);
            } else {
              error = this.props.intl.formatMessage({
                id: `errors.${error.slice(1)}`,
                defaultMessage: "INVALID_MESSAGE",
              });
            }

            if (error === "INVALID_MESSAGE") {
              console.warn("[INVALID_MESSAGE]", originalError);
              error = originalError;
            }
          }
          ErrorBagBase.cache[originalError] = error;
        }
      }

      return (
        <Box color="red" {...props}>
          {error}
        </Box>
      );
    }

    return null;
  }
}

export default styled(injectIntl(formikConnect<Props>(ErrorBagBase)))();
