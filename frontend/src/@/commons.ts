import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  createStructuredSelector,
  createSelector,
  createSelectorCreator,
} from 'reselect';

import { Switch, Route, Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

import React from 'react';
import PropTypes from 'prop-types';

export {
  Helmet,
  Switch,
  Route,
  Link,
  FormattedMessage,
  React,
  PropTypes,
  connect,
  compose,
  createStructuredSelector,
  createSelector,
  createSelectorCreator,
};
