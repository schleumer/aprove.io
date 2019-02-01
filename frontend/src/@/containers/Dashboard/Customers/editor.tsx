import { FastField, FieldArray, Formik, FormikProps } from "formik";
import React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import * as yup from "yup";

import globalMessages from "@/messages/global";
import { mutate } from "@/utils/graphql";
import {
  BoxGroup,
  Button,
  Icon,
  Padding,
} from "@b6y/ui/core";
import { ArrayOptions } from "@b6y/ui/core/SelectInput/adapter";
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
import { updateQuery } from "./graphql";
import messages from "./messages";

const validationSchema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  status: yup.string()
    .required("#required"),
  type: yup.string()
    .required("#required"),
  notes: yup.string(),
}).noUnknown();

const options = {
  statuses: new ArrayOptions([
    { value: "ACTIVE", label: messages.statusActive },
    { value: "INACTIVE", label: messages.statusInactive },
  ]),
  types: new ArrayOptions([
    { value: "NATURAL", label: messages.typeNatural },
    { value: "JURIDICAL", label: messages.typeJuridical },
  ]),
};

interface FormProps extends FormikProps<any> {
  options: typeof options;
}

class EditorForm extends React.Component<FormProps> {
  public render() {
    const { options, isSubmitting } = this.props;

    return (
      <Box>
        <Form>
          <Box>
            <Heading><FormattedMessage {...messages.infos} /></Heading>
            <BoxGroup spacing={3}>
              <Box mb={3} width={1 / 3}>
                <FastField name="code" label={messages.code} component={TextInput} disabled={true} />
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
      </Box>
    );
  }
}

interface Props extends InjectedIntlProps {
  data: any;
  onChange(newValue: any): void;
}

const initialValues = (base: any): any => {
  return {
    ...base,
    phone: {
      phone: null,
    },
    email: {
      email: null,
    },
  };
};

class Editor extends React.Component<Props> {
  public form?: React.RefObject<Formik>;

  constructor(a, b) {
    super(a, b);

    this.submit = this.submit.bind(this);
    this.form = React.createRef();
  }

  public async submit(values) {
    try {
      const customer = await validationSchema.validate(values);

      const response = await mutate({
        mutation: updateQuery,
        variables: {
          input: customer,
        },
      });

      // should not be after onChange.
      this.form.current.setSubmitting(false);

      this.props.onChange(response.data.result);
    } catch (err) {
      this.form.current.setSubmitting(false);
    }
  }

  public render() {
    const intlOptions = {
      statuses: options.statuses.intl(this.props.intl),
      types: options.types.intl(this.props.intl),
    };

    const { data } = this.props;

    return (
      <React.Fragment>
        <Formik
          ref={this.form}
          validationSchema={validationSchema}
          initialValues={initialValues(data)}
          onSubmit={this.submit}
          render={(props) => {
            return <EditorForm
              options={intlOptions}
              {...props} />;
          }}
          validateOnChange={false}
        />
      </React.Fragment>
    );
  }
}
export default injectIntl(Editor);
