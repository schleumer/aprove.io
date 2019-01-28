import injectReducer from "@/utils/injectReducer";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import * as actions from "./actions";
import reducer from "./reducer";

import { Formik } from "formik";

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
  key: "@/components/formik/Channel",
  reducer,
});

export function mapDispatchToProps(dispatch) {
  return {
    isSubmitting: (name, state) => dispatch(actions.isSubmitting(name, state)),
    register: (name) => dispatch(actions.register(name)),
  };
}

const mapStateToProps = createStructuredSelector({
  channelState(state, props) {
    return (state["@/components/formik/Channel"] || {})[props.name];
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
