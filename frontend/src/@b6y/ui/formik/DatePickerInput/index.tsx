import { FieldProps } from "formik";
import invariant from "invariant";
import memoize from "memoize-one";
import R from "ramda";
import React from "react";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";

import BaseInput from "../../core/DatePickerInput";
import Label from "../../core/Label";
import { genid } from "../commons";
import ErrorBag from "../ErrorBag";

interface Props extends FieldProps {
  fieldId: number;
  debugId: boolean;
  label: string | FormattedMessage.MessageDescriptor;
  placeholder: string | FormattedMessage.MessageDescriptor;
  intl: InjectedIntl;
}
interface State {}

// eslint-disable-next-line react/prefer-stateless-function
class TextInput extends React.PureComponent<Props, State> {
  public id = memoize((actualId) => genid("inline-date-picker-input", actualId));

  constructor(props) {
    super(props);

    this.changed = this.changed.bind(this);
    this.blurred = this.blurred.bind(this);
  }

  public changed(value) {
    const { name } = this.props.field;
    const { setFieldValue } = this.props.form;

    setFieldValue(name, value);
  }

  public blurred() {
    const { name } = this.props.field;
    const { handleBlur } = this.props.form;

    handleBlur(name);
  }

  public render() {
    const { fieldId, debugId, intl, field, ...props } = this.props;

    invariant(field, "Must be on Formik <Field/> or <FastField/>");

    const id = this.id(fieldId);

    let { placeholder, label } = props;

    if (!React.isValidElement(label) && R.is(Object, label)) {
      label = intl.formatMessage(label as FormattedMessage.MessageDescriptor);
    }

    if (label && !placeholder && typeof label === "string") {
      placeholder = label;
    }

    if (R.is(Object, placeholder)) {
      placeholder = intl.formatMessage(placeholder as FormattedMessage.MessageDescriptor);
    }

    let labelComponent = null;
    if (label) {
      labelComponent = (
        <Label htmlFor={id}>
          {label} {debugId ? <b>id: {id}</b> : null}
        </Label>
      );
    }

    const newProps = { ...props, label, placeholder, id };

    return (
      <div>
        {labelComponent}
        <BaseInput id={id} onBlur={this.blurred} onChange={this.changed} value={field.value} {...newProps} />
        <ErrorBag mt={1} field={field.name} />
      </div>
    );
  }
}

export default injectIntl(TextInput);
