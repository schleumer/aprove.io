import R from "ramda";
import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";
import { FieldProps } from "formik";
import invariant from "invariant";
import memoize from "memoize-one";
import React from "react";

import Label from "@/components/core/Label";
import BaseTextInput from "@/components/core/TextInput";

import ErrorBag from "../ErrorBag";
import { genid } from "../helpers";

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
  public id = memoize((actualId) => genid("text-input", actualId));

  public render() {
    const { fieldId, debugId, intl, ...props } = this.props;

    invariant(props.field, "Must be on Formik <Field/> or <FastField/>");

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

    newProps.field.value = R.isNil(newProps.field.value) ? '' : String(newProps.field.value);

    return (
      <div>
        {labelComponent}
        <BaseTextInput id={id} type="text" {...newProps.field} {...newProps} />
        <ErrorBag mt={1} field={props.field.name} />
      </div>
    );
  }
}

export default injectIntl(TextInput);
