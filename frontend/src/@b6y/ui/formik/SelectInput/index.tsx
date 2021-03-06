import { FormattedMessage, InjectedIntl, injectIntl } from "react-intl";
import { FieldProps } from "formik";
import invariant from "invariant";
import memoize from "memoize-one";
import R from "ramda";
import React from "react";

import Label from "../../core/Label";
import BaseSelectInput from "../../core/SelectInput";
import ErrorBag from "../ErrorBag";
import { genid } from "../commons";
import * as types from "../../styled/types";

interface Props extends types.Box, FieldProps {
  fieldId: number;
  debugId: boolean;
  isClearable: boolean;
  label: string | FormattedMessage.MessageDescriptor;
  placeholder: string | FormattedMessage.MessageDescriptor;
  intl: InjectedIntl;
}
interface State {}

class SelectInput extends React.PureComponent<Props, State> {
  public static defaultProps = {
    isClearable: true,
  };

  public id = memoize((actualId) => genid("select-input", actualId));

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

    return (
      <div>
        {labelComponent}
        <BaseSelectInput {...newProps} />
        <ErrorBag mt={1} field={props.field.name} />
      </div>
    );
  }
}

export default injectIntl(SelectInput);
