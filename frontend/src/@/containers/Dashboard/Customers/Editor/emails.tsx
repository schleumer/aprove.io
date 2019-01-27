import { FastField, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import * as yup from "yup";

import {
  Box,
  BoxGroup,
  Button,
  ButtonTransparent,
  Flex,
  Icon,
  Table,
  TableColumn,
  TableRow,
  Tooltip,
} from "@/components/core";
import { Form, TextInput } from "@/components/formik";

import * as actions from "../actions";
import messages from "../messages";

const emailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("#invalidEmail")
    .typeError("#invalidEmail"),
});

interface EmailFormProps extends FormikProps<any> {
  parent: any;
}

class EmailForm extends React.Component<EmailFormProps> {
  public render() {
    return (
      <Form>
        <BoxGroup py={3}>
          <Box width={1}>
            <FastField name="email" placeholder={messages.email} component={TextInput} />
          </Box>
          <Box flex="0 0 auto">
            <Button type="submit" state="primary" width={1}>Adicionar</Button>
          </Box>
        </BoxGroup>
      </Form>
    );
  }
}

interface EmailsEditorProps extends FieldArrayRenderProps {}

interface EmailsEditorDispatchProps {
  removeEmail(customerId: string, customerEmailId: string): void;
}

class EmailsEditor extends React.Component<EmailsEditorProps & EmailsEditorDispatchProps> {
  public form?: React.RefObject<any>;

  constructor(a, b) {
    super(a, b);

    this.submit = this.submit.bind(this);
    this.form = React.createRef();
  }

  public shouldComponentUpdate(
    nextProps: Readonly<EmailsEditorProps>,
    nextState: Readonly<{}>, nextContext: any,
  ): boolean {
    const values = this.props.form.values[this.props.name];
    const newValues = nextProps.form.values[nextProps.name];

    return values !== newValues;
  }

  public render() {
    const values = this.props.form.values[this.props.name];

    const rows = values.map((item, index) => {
      return (
        <TableRow key={item.email + "-" + item.id}>
          <TableColumn verticalAlign="middle" width={1}>
            { item.email }
          </TableColumn>
          <TableColumn verticalAlign="middle">
            <Tooltip text="Remover">
              <ButtonTransparent
                size="sm"
                state="danger"
                onClick={() => this.remove(item, index)}><Icon name="trash" /></ButtonTransparent>
            </Tooltip>
          </TableColumn>
        </TableRow>
      );
    });

    return (
      <React.Fragment>
        <Formik
          ref={this.form}
          initialValues={{
            email: null,
          }}
          validationSchema={emailValidationSchema}
          onSubmit={this.submit}
          render={(props) => {
            return <EmailForm parent={this.props} {...props} />;
          }}
          validateOnChange={false}
        />
        {rows.length > 0 && (
          <Table>
            <tbody>
            { rows }
            </tbody>
          </Table>
        )}
        {rows.length < 1 && (
          <Flex justifyContent="center" p={3}>Não há telefones</Flex>
        )}
      </React.Fragment>
    );
  }

  private remove(item, index) {
    const customer = this.props.form.values;

    this.props.removeEmail(customer.id, item.id);

    this.props.remove(index);
  }

  private submit({ email }) {
    this.props.push({ email });
    this.form.current.resetForm();
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    removeEmail: (customerId: string, customerEmailId: string) =>
      dispatch(actions.removeEmail({ customerId, customerEmailId })),
  };
}

const withConnect = connect<any, EmailsEditorDispatchProps, EmailsEditorProps>(
  (state, ownProps) => ownProps,
  mapDispatchToProps,
);

export default withConnect(injectIntl(EmailsEditor));
