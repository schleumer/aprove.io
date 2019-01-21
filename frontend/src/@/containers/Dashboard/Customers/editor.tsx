import { FastField, FieldArray, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import * as yup from "yup";

import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import {
  connect,
  createStructuredSelector,
  React,
} from "@/commons";

import {
  Box,
  BoxGroup,
  Button,
  ButtonTransparent,
  Heading,
  Icon,
  Padding,
  RouterButtonTransparent,
  Table,
  TableColumn,
  TableRow,
} from "@/components/core";

import Tooltip from "@/components/core/Tooltip";

import { Channel, Form, PhoneInput, SelectInput, TextInput } from "@/components/formik";

import messages from "./messages";

import { ArrayOptions } from "@/components/core/SelectInput/adapter";
import globalMessages from "@/messages/global";

import { formatPhoneNumberIntl, isValidPhoneNumber } from "react-phone-number-input";

const validationSchema = yup.object().shape({
  id: yup.number().required(),
});

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

interface PhoneFormProps extends FormikProps<any> {
  parent: any;
}

class PhoneForm extends React.Component<PhoneFormProps> {
  public render() {
    return (
      <Form mb={1}>
        <BoxGroup>
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

interface PhonesEditorProps extends FieldArrayRenderProps {}

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

  public remove(item, index) {
    this.props.remove(index);
  }

  public submit({ phone }) {
    this.props.push({ phone });
    this.form.current.resetForm();
  }

  public render() {
    const values = this.props.form.values[this.props.name];

    const rows = values.map((item, index) => {
      return (
        <TableRow>
          <TableColumn verticalAlign="middle" width={1}>{ formatPhoneNumberIntl(item.phone) }</TableColumn>
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
        <Table>
          { rows }
        </Table>
      </React.Fragment>
    );
  }
}

class EditorForm extends React.Component<FormProps> {
  public render() {
    const { options, isSubmitting } = this.props;

    return (
      <Form>
        <Box>
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
            <Box width={1 / 3}>
              <Heading><FormattedMessage {...messages.phones} /></Heading>
              <FieldArray name="phones" component={PhonesEditor}/>
            </Box>
          </BoxGroup>
          <Padding spacing={3}>
            <Button state="primary" disabled={isSubmitting} type="submit">
              <Icon name="check" />
              <FormattedMessage {...globalMessages.save} />
            </Button>
            <RouterButtonTransparent to="/customers" disabled={isSubmitting}>
              <FormattedMessage {...globalMessages.cancel} />
            </RouterButtonTransparent>
          </Padding>
        </Box>
      </Form>
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
    console.log(":'(", a, b);
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
