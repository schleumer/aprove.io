import { call, put, takeLatest } from "redux-saga/effects";

import {
  authenticated,
  authenticateErrors,
  resetState,
  setToken,
} from "@/root/actions";

import gql from "graphql-tag";

import history from "@/history";

import graphQLCreator, { Response } from "@b6y/ui/graphql";

import * as loadingActions from "@b6y/ui/core/Loading/actions";

import {
  AUTHENTICATE,
  GO_TO_LOGIN,
  LOGOUT,
  PERSIST_AUTHENTICATE,
  REAUTHENTICATE,
} from "./constants";

export function* tryAuthenticate(form) {
  const { mutate } = graphQLCreator({});
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
        instance: "!guess",
      },
    },
  };

  const response: Response<{}> = yield call(mutate, "result", options);

  if (response.successful) {
    yield put(authenticateErrors([]));

    const { result } = response;

    Object.defineProperty(result, "$managed", {
      value: true,
    });

    localStorage.setItem("aprove-io:auth", JSON.stringify(result));

    yield persistAuthenticate(result);
  } else {
    yield put(authenticateErrors(response.errors));

    yield put(loadingActions.setState("global", false));
  }
}

export function* persistAuthenticate(data) {
  const { token, user } = data;

  yield put(authenticated({ token, user }));
  history.push("/");
}

export function* tryPersistAuthenticate(action) {
  yield persistAuthenticate(action.data);
}

export function* logout() {
  localStorage.removeItem("aprove-io:auth");
  yield put(resetState());
  history.push("/login");
}

export function* reauthenticate(action) {
  const {
    data: { data, from },
  } = action;

  yield put(loadingActions.setState("global", true));

  if (!data.$managed) {
    yield put(loadingActions.setState("global", false));

    return;
  }

  const { query } = graphQLCreator({
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

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

  const response: Response<{}> = yield call(query, "result", options);

  if (response.successful) {
    yield put(authenticateErrors([]));

    yield put(loadingActions.setState("global", false));

    yield persistAuthenticate(data);

    history.push(from || "/");
  } else {
    yield put(authenticateErrors(response.errors));

    yield put(loadingActions.setState("global", false));

    history.push("/login");
  }
}

export function* goToLogin(from) {
  localStorage.removeItem("aprove-io:auth");
  yield put(resetState());
  yield put(loadingActions.setState("global", false));
  history.push("/login");
}

export default function* login() {
  yield takeLatest(GO_TO_LOGIN, goToLogin);
  yield takeLatest(LOGOUT, logout);
  yield takeLatest(AUTHENTICATE, tryAuthenticate);
  yield takeLatest(REAUTHENTICATE, reauthenticate);
  yield takeLatest(PERSIST_AUTHENTICATE, tryPersistAuthenticate);
}
