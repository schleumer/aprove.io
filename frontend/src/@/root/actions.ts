import {
  AUTHENTICATE,
  AUTHENTICATE_ERRORS,
  AUTHENTICATED,
  GO_TO_LOGIN,
  LOGOUT,
  PERSIST_AUTHENTICATE,
  REAUTHENTICATE,
  RESET_STATE,
  SET_TOKEN,
} from "./constants";

export function authenticate(form) {
  return {
    type: AUTHENTICATE,
    data: form,
  };
}

export function logout() {
  return {
    type: LOGOUT,
    data: null,
  };
}

export function resetState() {
  return {
    type: RESET_STATE,
    data: null,
  };
}

export function authenticateErrors(errors) {
  return {
    type: AUTHENTICATE_ERRORS,
    data: errors,
  };
}

export function authenticated(data) {
  return {
    type: AUTHENTICATED,
    data,
  };
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    data: token,
  };
}

export function persistAuthenticate(data) {
  return {
    type: PERSIST_AUTHENTICATE,
    data,
  };
}

export function goToLogin(from) {
  return {
    type: GO_TO_LOGIN,
    data: from,
  };
}

export function reauthenticate(data, from) {
  return {
    type: REAUTHENTICATE,
    data: {
      data,
      from,
    },
  };
}
