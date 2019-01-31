import { FastField, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import gql from "graphql-tag";
import React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
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
} from "@b6y/ui/core";
import { Form, TextInput } from "@b6y/ui/formik";
import { mutate } from "@/utils/graphql";

import messages from "../messages";

const removeEmailQuery = gql`
  mutation($customerId: Long!, $customerEmailId: Long!) {
    result: removeCustomerEmail(customerId: $customerId, customerEmailId: $customerEmailId)
  }
`;

const createEmailQuery = gql`
  mutation($customerId: Long!, $input: CreateCustomerEmailInput!) {
    result: createCustomerEmail(customerId: $customerId, input: $input) {
      id
      customerId
      email
      position
    }
  }
`;

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

interface EmailsEditorProps extends FieldArrayRenderProps, InjectedIntlProps {}

class EmailsEditor extends React.Component<EmailsEditorProps> {
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

  private async remove(item, index) {
    const customer = this.props.form.values;

    await mutate({
      mutation: removeEmailQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        customerEmailId: parseInt(item.id, 0),
      },
    });

    this.props.remove(index);
  }

  private async submit({ email }) {
    const customer = this.props.form.values;

    const result = await mutate({
      mutation: createEmailQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        input: { email },
      },
    });

    this.props.push(result.data.result);
    this.form.current.resetForm();
  }
}

export default injectIntl<EmailsEditorProps>(EmailsEditor);
