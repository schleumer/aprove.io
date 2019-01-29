import styled from "@emotion/styled";
import { connect, FormikContext } from "formik";
import React from "react";

import { Box } from "../../styled";
import * as types from "../../styled/types";

export type FormikFormProps = Pick<
  React.FormHTMLAttributes<HTMLFormElement>,
  Exclude<
    keyof React.FormHTMLAttributes<HTMLFormElement>,
    "onReset" | "onSubmit"
    >
  > & { formik: FormikContext<any> } & types.Box;

const Form = styled(Box.withComponent("form"))``;

class FormikForm extends React.Component<FormikFormProps> {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  public render() {
    const { formik: _, ...props } = this.props;

    return <Form onReset={this.onReset} onSubmit={this.onSubmit} {...props} />;
  }

  private onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const { formik: { handleSubmit } } = this.props;

    event.stopPropagation();

    return handleSubmit(event);
  }

  private onReset(event: React.FormEvent<HTMLFormElement>) {
    const { formik: { handleReset } } = this.props;

    return handleReset();
  }
}

export default connect(FormikForm);
