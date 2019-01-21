import { call, put, takeEvery } from "redux-saga/effects";

import gql from "graphql-tag";

import { query } from "@/utils/graphql";

import * as loadingActions from "@/components/core/Loading/actions";

import { VIEW } from "./constants";

import { setView } from "./actions";

const viewQuery = gql`
  query($id: Long!) {
    result: customer(id: $id) {
      id
      code
      name
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

interface HandleView {
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

export default function* cutomers() {
  yield takeEvery(VIEW, handleView);
}
