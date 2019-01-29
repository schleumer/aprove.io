import { Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import * as actions from "./actions";
import reducer from "./reducer";
import injectReducer from "../../commons/injectReducer";

interface Props {
  name: string;
  isSubmitting: Function;
  register: Function;
  children: React.ReactNode;
  channelState: {
    isSubmitting: boolean,
  };
}

interface State {}

class Channel extends React.Component<Props, State> {
  public formRef = React.createRef<Formik>();

  public static actions = actions;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  public componentDidMount() {
    if (!this.props.name) {
      console.error("Invalid <Channel />, name is required.");
      return;
    }

    console.log(`Channel \`${this.props.name}\` up`);

    this.props.register(this.props.name);
  }

  public componentDidUpdate() {
    const { channelState } = this.props;

    if (this.formRef.current) {
      this.formRef.current.setSubmitting(channelState.isSubmitting);
    }
  }

  public onSubmit(childProps, onSubmit) {
    return (values, form) => {
      const { isSubmitting, name } = this.props;

      console.log("%s is submitting", name);

      isSubmitting(name, true);

      return onSubmit(values, form);
    };
  }

  public render() {
    const { children, name } = this.props;

    if (!name) {
      return <b>Invalid.</b>;
    }

    return React.Children.map(children, (_child) => {
      const child = _child as React.ReactElement<any>;

      return React.cloneElement(child, {
        ref: this.formRef,
        onSubmit: this.onSubmit(child.props, child.props.onSubmit),
      });
    });
  }
}

const withReducer = injectReducer({
  key: "@b6y/ui/formik/Channel",
  reducer,
});

export function mapDispatchToProps(dispatch) {
  return {
    isSubmitting: (name: string, state: boolean) => dispatch(actions.isSubmitting(name, state)),
    register: (name: string) => dispatch(actions.register(name)),
  };
}

const mapStateToProps = createStructuredSelector({
  channelState(state, props) {
    return (state["@b6y/ui/formik/Channel"] || {})[props.name];
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withConnect,
)(Channel);
