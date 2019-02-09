import { FastField, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import gql from "graphql-tag";
import React, { useRef } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
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
import { Form, TextInput } from "@b6y/ui/formik";
import { Box, Flex } from "@b6y/ui/styled";

import * as graphql from "@/hooks/graphql";

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

class EmailForm extends React.PureComponent<EmailFormProps> {
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

const EmailsEditor = (props: EmailsEditorProps) => {
  const methods = graphql.useGraphQLMethods();
  const formRef = useRef(null);

  const values = props.form.values[props.name];

  const submit = ({ email }) => {
    const customer = props.form.values;

    methods.mutate("result", {
      mutation: createEmailQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        input: { email },
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
      mutation: removeEmailQuery,
      variables: {
        customerId: parseInt(customer.id, 0),
        customerEmailId: parseInt(item.id, 0),
      },
    }).then((response) => {
      props.remove(index);
    });
  };

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
          email: null,
        }}
        validationSchema={emailValidationSchema}
        onSubmit={submit}
        render={(props) => {
          return <EmailForm parent={props} {...props} />;
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

const SafeEmailsEditor = React.memo(EmailsEditor, (
  props: Readonly<EmailsEditorProps>,
  nextProps: Readonly<EmailsEditorProps>,
): boolean => {
  const values = props.form.values[props.name];
  const newValues = nextProps.form.values[nextProps.name];

  return values === newValues;
});

export default injectIntl<EmailsEditorProps>(SafeEmailsEditor);
