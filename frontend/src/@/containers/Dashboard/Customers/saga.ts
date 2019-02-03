import { call, put, takeEvery } from "redux-saga/effects";

import * as loadingActions from "@b6y/ui/core/Loading/actions";
import graphQLCreator from "@b6y/ui/graphql";

import { setView, ViewData } from "./actions";
import { VIEW } from "./constants";
import { viewQuery } from "./graphql";

interface HandleView {
  data: ViewData;
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

export default function* customers() {
  yield takeEvery(VIEW, handleView);
}
