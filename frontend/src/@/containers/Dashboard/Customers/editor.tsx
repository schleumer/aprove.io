import { FastField, FieldArray, Formik, FormikProps } from "formik";
import React, { useRef } from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import * as yup from "yup";

import history from "@/history";
import * as graphql from "@/hooks/graphql";
import globalMessages from "@/messages/global";
import {
  BoxGroup,
  Button,
  Icon,
  Padding,
} from "@b6y/ui/core";
import { ArrayAdapter } from "@b6y/ui/core/SelectInput/adapter";
import {
  Form,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "@b6y/ui/formik";
import { RouterButtonTransparent } from "@b6y/ui/router";
import { Box, Heading } from "@b6y/ui/styled";

import EmailsEditor from "./Editor/emails";
import PhonesEditor from "./Editor/phones";
import { updateQuery, createQuery } from "./graphql";
import messages from "./messages";

const validationSchema = yup.object().shape({
  id: yup.number(),
  name: yup.string().required(),
  status: yup.string()
    .required("#required"),
  type: yup.string()
    .required("#required"),
  notes: yup.string(),
}).noUnknown();

const options = {
  statuses: new ArrayAdapter([
    { value: "ACTIVE", label: messages.statusActive },
    { value: "INACTIVE", label: messages.statusInactive },
  ]),
  types: new ArrayAdapter([
    { value: "NATURAL", label: messages.typeNatural },
    { value: "JURIDICAL", label: messages.typeJuridical },
  ]),
};

interface FormProps extends FormikProps<any> {
  options: typeof options;
}

class EditorForm extends React.PureComponent<FormProps> {
  public render() {
    const { options, isSubmitting, values } = this.props;

    return (
      <Box>
        <Form>
          <Box>
            <Heading><FormattedMessage {...messages.infos} /></Heading>
            <BoxGroup spacing={3}>
              <Box mb={3} width={1 / 3}>
                {values.code && (
                  <FastField name="code" label={messages.code} component={TextInput} disabled />
                )}
                {!values.code && (
                  <FastField name="code"
                             label={messages.code}
                             component={TextInput}
                             disabledValue={messages.newCode}
                             disabled />
                )}
              </Box>
              <Box mb={3} width={1 / 3}>
                <FastField name="name" label={messages.name} component={TextInput} />
              </Box>
              <Box mb={3} width={1 / 3}>
                <FastField
                  label={messages.status}
                  component={SelectInput}
                  isClearable={false}
                  options={options.statuses}
                  name="status"
                />
              </Box>
            </BoxGroup>
            <BoxGroup spacing={3}>
              <Box mb={3} width={1 / 3}>
                <FastField
                  label={messages.type}
                  component={SelectInput}
                  isClearable={false}
                  options={options.types}
                  name="type"
                />
              </Box>
            </BoxGroup>
            <BoxGroup spacing={3}>
              <Box mb={3} width={1}>
                <FastField
                  label={messages.notes}
                  component={TextAreaInput}
                  name="notes"
                  rows={4}
                />
              </Box>
            </BoxGroup>
          </Box>
          <Padding spacing={3} inverse>
            <Button state="primary" disabled={isSubmitting} type="submit">
              <Icon name="check" />
              <FormattedMessage {...globalMessages.save} />
            </Button>
            <RouterButtonTransparent to="/customers" disabled={isSubmitting}>
              <FormattedMessage {...globalMessages.cancel} />
            </RouterButtonTransparent>
          </Padding>
        </Form>
        {values.id && (
          <BoxGroup spacing={3} mt={3}>
            <Box width={1 / 2}>
              <Heading mb={0}><FormattedMessage {...messages.phones} /></Heading>
              <FieldArray name="phones" component={PhonesEditor}/>
            </Box>
            <Box width={1 / 2}>
              <Heading mb={0}><FormattedMessage {...messages.emails} /></Heading>
              <FieldArray name="emails" component={EmailsEditor}/>
            </Box>
          </BoxGroup>
        )}
      </Box>
    );
  }
}

interface Props extends InjectedIntlProps {
  data: any;
  onChange?: (newValue: any) => void;
}

const initialValues = (base: any): any => {
  return {
    ...base,
    status: "ACTIVE",
    phones: [],
    emails: [],
    phone: {
      phone: null,
    },
    email: {
      email: null,
    },
  };
};

const Editor2 = (props: Props) => {
  const methods = graphql.useGraphQLMethods();

  const formRef = useRef(null);

  const intlOptions = {
    statuses: options.statuses.intl(props.intl),
    types: options.types.intl(props.intl),
  };

  const submit = (values) => {
    validationSchema
      .validate(values)
      .then((customer) => {
        if (customer.id) {
          return methods.mutate("result", {
            mutation: updateQuery,
            variables: {
              input: customer,
            },
          });
        } else {
          return methods.mutate("result", {
            mutation: createQuery,
            variables: {
              input: customer,
            },
          });
        }
      })
      .then((response) => {
        formRef.current.setSubmitting(false);

        props.onChange && props.onChange(response.result);

        history.replace(`/customers/${response.result.id}`);
      })
      .catch((e) => {
        formRef.current.setSubmitting(false);
        throw e;
      });
  };

  const { data } = props;

  return (
    <React.Fragment>
      <Formik
        ref={formRef}
        validationSchema={validationSchema}
        initialValues={initialValues(data)}
        onSubmit={submit}
        render={(props) => {
          return <EditorForm
            options={intlOptions}
            {...props} />;
        }}
        validateOnBlur={false}
        validateOnChange={false}
      />
    </React.Fragment>
  );
};

export default injectIntl(Editor2);
