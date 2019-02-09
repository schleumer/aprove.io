import { call, put, select, takeEvery } from "redux-saga/effects";

import { BuiltSearch } from "./index";

import { View } from "./types";

import { Query } from "../../search";

export default (builtSearch: BuiltSearch) => {
  const {
    DO_SEARCH,
    DO_REGISTER,
    REGISTER,
    DO_REGISTER_AND_SEARCH,
  } = builtSearch.constants;
  const { setLoading, setCurrent } = builtSearch.actions;

  function* doSearch({
    data: {
      params: { page: newPage },
      search: newSearch,
      name,
    },
  }) {
    console.time("search");
    console.time("search1");

    const globalState = yield select();
    const state: View = yield select(builtSearch.selector(name));

    console.timeEnd("search1");
    console.time("search2");

    const {
      env,
      current,
      defaultSearch,
      fields,
      search: previousSearch,
      sort,
    } = state;

    const currentSearch = newSearch || previousSearch;

    const page = newPage || current.currentPage;
    const limit = Math.min(Math.max(current.itemsPerPage, 1), 50);

    console.timeEnd("search2");
    console.time("search3");

    yield put(setLoading(name, true));

    console.timeEnd("search3");
    console.time("search4");

    const runParams = {
      fields,
      sort,
      limit,
      page,
      search: { ...defaultSearch, ...currentSearch },
      previousSearch,
    } as Query;

    const result = yield call(builtSearch.adapter.run, runParams, globalState, env);

    console.timeEnd("search4");
    console.time("search5");

    yield put(setCurrent(name, result, runParams.search));

    console.timeEnd("search5");
    console.timeEnd("search");
  }

  function* doRegister({ data }) {
    yield put({ type: REGISTER, data });
  }

  function* doRegisterAndSearch({ data: { component, search, params } }) {
    yield put({ type: REGISTER, data: component });

    yield put({
      type: DO_SEARCH,
      data: { search, params, name: component.name },
    });
  }

  return function* saga() {
    yield takeEvery(DO_REGISTER_AND_SEARCH, doRegisterAndSearch);
    yield takeEvery(DO_REGISTER, doRegister);
    yield takeEvery(DO_SEARCH, doSearch);
  };
};
