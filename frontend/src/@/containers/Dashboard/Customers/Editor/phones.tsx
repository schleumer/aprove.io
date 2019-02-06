import { FastField, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import gql from "graphql-tag";
import React, { useRef } from "react";
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

import * as graphql from "@/hooks/graphql";

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

const PhonesEditor = (props: PhonesEditorProps) => {
  const methods = graphql.useGraphQLMethods();
  const formRef = useRef(null);

  const values = props.form.values[props.name];

  const submit = ({ phone }) => {
    const customer = props.form.values;

    methods.mutate("result", {
      mutation: createPhoneQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        input: { phone },
      },
    }).then((response) => {
      if (response.successful) {
        props.push(response.result);
        formRef.current.resetForm();
      }
    });
  };

  const remove = (item, index) => {
    const customer = props.form.values;

    methods.mutate("result", {
      mutation: removePhoneQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        customerPhoneId: parseInt(item.id, 0),
      },
    }).then((response) => {
      props.remove(index);
    });
  };

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
              onClick={() => remove(item, index)}><Icon name="trash" /></ButtonTransparent>
          </Tooltip>
        </TableColumn>
      </TableRow>
    );
  });

  return (
    <>
      <Formik
        ref={formRef}
        initialValues={{
          phone: null,
        }}
        validationSchema={phoneValidationSchema}
        onSubmit={submit}
        render={(props) => {
          return <PhoneForm parent={props} {...props} />;
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
    </>
  );
};

const SafePhonesEditor = React.memo(PhonesEditor, (
  props: Readonly<PhonesEditorProps>,
  nextProps: Readonly<PhonesEditorProps>,
): boolean => {
  const values = props.form.values[props.name];
  const newValues = nextProps.form.values[nextProps.name];

  return values === newValues;
});

export default injectIntl<PhonesEditorProps>(SafePhonesEditor);
