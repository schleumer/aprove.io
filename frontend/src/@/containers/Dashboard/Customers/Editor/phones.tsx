import { FastField, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import gql from "graphql-tag";
import React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { formatPhoneNumberIntl, isValidPhoneNumber } from "react-phone-number-input";
import * as yup from "yup";

import {
  BoxGroup,
  Button,
  ButtonTransparent,
  Icon,
  Table,
  TableColumn,
  TableRow,
  Tooltip,
} from "@b6y/ui/core";
import { Form, PhoneInput } from "@b6y/ui/formik";
import { Box, Flex } from "@b6y/ui/styled";

import messages from "../messages";

const removePhoneQuery = gql`
  mutation($customerId: Long!, $customerPhoneId: Long!) {
    result: removeCustomerPhone(customerId: $customerId, customerPhoneId: $customerPhoneId)
  }
`;

const createPhoneQuery = gql`
  mutation($customerId: Long!, $input: CreateCustomerPhoneInput!) {
    result: createCustomerPhone(customerId: $customerId, input: $input) {
      id
      customerId
      phone
      position
    }
  }
`;

const phoneValidationSchema = yup.object().shape({
  phone: yup
    .string()
    .test(
      "phone",
      "#invalidPhone",
      (value) => isValidPhoneNumber(String(value)),
    )
    .nullable(true),
});

interface PhoneFormProps extends FormikProps<any> {
  parent: any;
}

class PhoneForm extends React.Component<PhoneFormProps> {
  public render() {
    return (
      <Form>
        <BoxGroup py={3}>
          <Box width={1}>
            <FastField name="phone" placeholder={messages.phone} country="BR" component={PhoneInput} />
          </Box>
          <Box flex="0 0 auto">
            <Button type="submit" state="primary" width={1}>Adicionar</Button>
          </Box>
        </BoxGroup>
      </Form>
    );
  }
}

interface PhonesEditorProps extends FieldArrayRenderProps, InjectedIntlProps {}

class PhonesEditor extends React.Component<PhonesEditorProps> {
  public form?: React.RefObject<any>;

  constructor(a, b) {
    super(a, b);

    this.submit = this.submit.bind(this);
    this.form = React.createRef();
  }

  public shouldComponentUpdate(
    nextProps: Readonly<PhonesEditorProps>,
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
        <TableRow key={item.phone + "-" + item.id}>
          <TableColumn verticalAlign="middle" width={1}>
            { formatPhoneNumberIntl(item.phone) }
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
            phone: null,
          }}
          validationSchema={phoneValidationSchema}
          onSubmit={this.submit}
          render={(props) => {
            return <PhoneForm parent={this.props} {...props} />;
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
      mutation: removePhoneQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        customerPhoneId: parseInt(item.id, 0),
      },
    });

    this.props.remove(index);
  }

  private async submit({ phone }) {
    const customer = this.props.form.values;

    const result = await mutate({
      mutation: createPhoneQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        input: { phone },
      },
    });

    this.props.push(result.data.result);
    this.form.current.resetForm();
  }
}

export default injectIntl<PhonesEditorProps>(PhonesEditor);
