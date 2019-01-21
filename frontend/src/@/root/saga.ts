import { call, put, takeLatest } from 'redux-saga/effects';

import {
  authenticateErrors,
  setToken,
  authenticated,
  resetState,
} from '@/root/actions';

import gql from 'graphql-tag';

import history from '@/history';

import { mutate, query, upgradeErrors } from '@/utils/graphql';

import * as loadingActions from '@/components/core/Loading/actions';

import {
  AUTHENTICATE,
  GO_TO_LOGIN,
  LOGOUT,
  PERSIST_AUTHENTICATE,
  REAUTHENTICATE,
} from './constants';

export function* tryAuthenticate(form) {
  const { data } = form;

  const options = {
    mutation: gql`
      mutation($input: AuthenticateInput!) {
        result: authenticate(input: $input) {
          user {
            id
            name
            email
          }
          token
        }
      }
    `,
    variables: {
      input: {
        username: data.username,
        password: data.password,
        instance: '!guess',
      },
    },
  };

  try {
    const response = yield call(mutate, options);

    if (!response.data) {
      yield put(authenticateErrors(upgradeErrors(new Error('failed'))));

      yield put(loadingActions.setState('global', false));

      return;
    }

    yield put(authenticateErrors([]));

    const { result } = response.data;

    result.$managed = true;

    localStorage.setItem('aprove-io:auth', JSON.stringify(result));

    yield persistAuthenticate(result);
  } catch (e) {
    yield put(authenticateErrors(upgradeErrors(e)));
  }
}

export function* persistAuthenticate(data) {
  const { token, user } = data;

  yield put(authenticated({ token, user }));
  history.push('/');
}

export function* tryPersistAuthenticate(action) {
  yield persistAuthenticate(action.data);
}

export function* logout() {
  localStorage.removeItem('aprove-io:auth');
  yield put(resetState());
  history.push('/login');
}

export function* reauthenticate(action) {
  const {
    data: { data, from },
  } = action;

  yield put(loadingActions.setState('global', true));

  if (!data.$managed) {
    yield put(loadingActions.setState('global', false));

    return;
  }

  yield put(setToken(data.token));

  const options = {
    query: gql`
      query {
        result: currentUser {
          id
          name
          email
        }
      }
    `,
  };

  try {
    const response = yield call(query, options);

    if (!response.data) {
      yield put(authenticateErrors(upgradeErrors(new Error('failed'))));

      yield put(loadingActions.setState('global', false));

      return;
    }

    yield put(authenticateErrors([]));

    yield put(loadingActions.setState('global', false));
    yield persistAuthenticate(data);

    history.push(from || '/');
  } catch (e) {
    yield put(authenticateErrors(upgradeErrors(e)));

    yield put(loadingActions.setState('global', false));

    history.push('/login');
  }
}

export function* goToLogin(from) {
  localStorage.removeItem('aprove-io:auth');
  yield put(resetState());
  yield put(loadingActions.setState('global', false));
  history.push('/login');
}

export default function* login() {
  yield takeLatest(GO_TO_LOGIN, goToLogin);
  yield takeLatest(LOGOUT, logout);
  yield takeLatest(AUTHENTICATE, tryAuthenticate);
  yield takeLatest(REAUTHENTICATE, reauthenticate);
  yield takeLatest(PERSIST_AUTHENTICATE, tryPersistAuthenticate);
}
