import { call, put, takeEvery } from "redux-saga/effects";

import gql from "graphql-tag";

import { mutate, query } from "@/utils/graphql";

import * as loadingActions from "@/components/core/Loading/actions";

import { REMOVE_EMAIL, REMOVE_PHONE, VIEW } from "./constants";

import { RemoveEmailData, RemovePhoneData, setView, ViewData } from "./actions";

const viewQuery = gql`
  query($id: Long!) {
    result: customer(id: $id) {
      id
      code
      name
      notes
      status
      type
      document
      phones {
        id
        position
        phone
      }
      emails {
        id
        position
        email
      }
    }
  }
`;

const removePhoneQuery = gql`
  mutation($customerId: Long!, $customerPhoneId: Long!) {
    result: removeCustomerPhone(customerId: $customerId, customerPhoneId: $customerPhoneId)
  }
`;

const removeEmailQuery = gql`
  mutation($customerId: Long!, $customerEmailId: Long!) {
    result: removeCustomerEmail(customerId: $customerId, customerEmailId: $customerEmailId)
  }
`;

interface HandleView {
  data: ViewData;
}

interface HandleCreatePhone {
  data: {
    id: string,
  };
}

interface HandleCreateEmail {
  data: {
    id: string;
  };
}

interface HandleRemovePhone {
  data: RemovePhoneData;
}

interface HandleRemoveEmail {
  data: RemoveEmailData;
}

export function* handleView(action: HandleView) {
  const { data: { id } }: HandleView = action;

  yield put(loadingActions.setState("customers/view", true));

  const res = yield call(query, {
    query: viewQuery,
    variables: {
      id: parseInt(id, 0),
    },
  });

  yield put(setView(res.data.result));

  yield put(loadingActions.setState("customers/view", false));
}

export function* handleCreatePhone(action: HandleCreatePhone) {

}

export function* handleCreateEmail(action: HandleCreateEmail) {

}

export function* handleRemovePhone(action: HandleRemovePhone) {
  const { data: { customerId, customerPhoneId } } = action;

  yield call(mutate, {
    mutation: removePhoneQuery,
    variables: {
      customerId: parseInt(customerId, 0),
      customerPhoneId: parseInt(customerPhoneId, 0),
    },
  });
}

export function* handleRemoveEmail(action: HandleRemoveEmail) {
  const { data: { customerId, customerEmailId } } = action;

  yield call(mutate, {
    mutation: removeEmailQuery,
    variables: {
      customerId: parseInt(customerId, 0),
      customerPhoneId: parseInt(customerEmailId, 0),
    },
  });
}

export default function* customers() {
  yield takeEvery(VIEW, handleView);
  yield takeEvery(REMOVE_PHONE, handleRemovePhone);
  yield takeEvery(REMOVE_EMAIL, handleRemoveEmail);
}
