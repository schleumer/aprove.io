import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '@/utils/injectReducer';
import reducer from './reducer';
import * as actions from './actions';

interface Props {
  name: string,
  isSubmitting: Function,
  register: Function,
  children: React.ReactNode,
  channelState: {
    isSubmitting: boolean
  },
}

interface State {}

class Channel extends React.Component<Props, State> {
  static actions = actions;
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (!this.props.name) {
      console.error('Invalid <Channel />, name is required.');
      return;
    }

    console.log(`Channel \`${this.props.name}\` up`);

    this.props.register(this.props.name);
  }

  componentDidUpdate() {
    const { channelState, children } = this.props;
    const el = React.Children.only(children);

    // XXX: ???
    // @ts-ignore
    const formRef = el && el.ref && el.ref.current;

    if (formRef) {
      formRef.setSubmitting(channelState.isSubmitting);
    }
  }

  onSubmit(childProps, onSubmit) {
    return (values, form) => {
      const { isSubmitting, name } = this.props;

      console.log('%s is submitting', name);

      isSubmitting(name, true);

      return onSubmit(values, form);
    };
  }

  render() {
    const { children, name } = this.props;

    if (!name) {
      return <b>Invalid.</b>;
    }

    return React.Children.map(children, _child => {
      const child = _child as React.ReactElement<any>;

      return React.cloneElement(child, {
        onSubmit: this.onSubmit(child.props, child.props.onSubmit),
      })
    });
  }
}

const withReducer = injectReducer({
  key: '@/components/formik/Channel',
  reducer,
});

export function mapDispatchToProps(dispatch) {
  return {
    isSubmitting: (name, state) => dispatch(actions.isSubmitting(name, state)),
    register: name => dispatch(actions.register(name)),
  };
}

const mapStateToProps = createStructuredSelector({
  channelState(state, props) {
    return state['@/components/formik/Channel'][props.name];
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
