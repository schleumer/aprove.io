import { FastField, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import React from "react";
import { injectIntl } from "react-intl";
import { formatPhoneNumberIntl, isValidPhoneNumber } from "react-phone-number-input";
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
  Tooltip
} from "@/components/core";
import { Form, PhoneInput } from "@/components/formik";

import * as actions from "../actions";
import messages from "../messages";

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

interface PhonesEditorProps extends FieldArrayRenderProps {}

interface PhonesEditorDispatchProps {
  removePhone(customerId: string, customerPhoneId: string): void;
}

class PhonesEditor extends React.Component<PhonesEditorProps & PhonesEditorDispatchProps> {
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

  private remove(item, index) {
    const customer = this.props.form.values;

    this.props.removePhone(customer.id, item.id);

    this.props.remove(index);
  }

  private submit({ phone }) {
    this.props.push({ phone });
    this.form.current.resetForm();
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    removePhone: (customerId: string, customerPhoneId: string) =>
      dispatch(actions.removePhone({ customerId, customerPhoneId })),
  };
}

const withConnect = connect<any, PhonesEditorDispatchProps, PhonesEditorProps>(
  (state, ownProps) => ownProps,
  mapDispatchToProps,
);

export default withConnect(injectIntl(PhonesEditor));
