import { call, put, takeEvery } from "redux-saga/effects";

import gql from "graphql-tag";

import { mutate, query } from "@/utils/graphql";

import * as loadingActions from "@/components/core/Loading/actions";

import { REMOVE_PHONE, VIEW } from "./constants";

import { setView } from "./actions";

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

interface HandleView {
  data: {
    id: string,
  };
}

interface HandleCreatePhone {
  data: {
    id: string,
  };
}

interface HandleCreateEmail {
  data: {
    id: string,
  };
}

interface HandleRemovePhone {
  data: {
    customerId: string,
    customerPhoneId: string,
  };
}

interface HandleRemoveEmail {
  data: {
    id: string,
  };
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
  const { data: { customerId, customerPhoneId } }: HandleRemovePhone = action;

  yield call(mutate, {
    mutation: removePhoneQuery,
    variables: {
      customerId: parseInt(customerId, 0),
      customerPhoneId: parseInt(customerPhoneId, 0),
    },
  });
}

export function* handleRemoveEmail(action: HandleRemoveEmail) {

}

export default function* cutomers() {
  yield takeEvery(VIEW, handleView);
  yield takeEvery(REMOVE_PHONE, handleRemovePhone);
}
