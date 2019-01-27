import { FastField, FieldArray, Formik, FormikProps } from "formik";
import React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import * as yup from "yup";

import {
  Box,
  BoxGroup,
  Button,
  Heading,
  Icon,
  Padding,
  RouterButtonTransparent,
} from "@/components/core";
import { ArrayOptions } from "@/components/core/SelectInput/adapter";
import {
  Channel,
  Form,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "@/components/formik";
import globalMessages from "@/messages/global";

import PhonesEditor from "./Editor/phones";
import EmailsEditor from "./Editor/emails";
import messages from "./messages";

const validationSchema = yup.object().shape({
  id: yup.number().required(),
});

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
  isSubmitting: (_: boolean) => void;
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
  public form?: React.RefObject<any>;

  constructor(a, b) {
    super(a, b);

    this.submit = this.submit.bind(this);
    this.form = React.createRef();
  }

  public submit(a, b) {
    this.props.isSubmitting(false);
  }

  public render() {
    const intlOptions = {
      statuses: options.statuses.intl(this.props.intl),
      types: options.types.intl(this.props.intl),
    };

    const { data } = this.props;

    return (
      <React.Fragment>
        <Channel name="customers/editor">
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
        </Channel>
      </React.Fragment>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    isSubmitting: (state) =>
      dispatch(Channel.actions.isSubmitting("customers/editor", state)),
  };
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(injectIntl(Editor));
