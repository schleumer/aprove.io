import { client } from "@/utils";
import gql from "graphql-tag";
import { call, put, select, takeEvery } from "redux-saga/effects";

import { BuiltSearch } from "./index";

const querySearch = ({
  argsHeader,
  argsRefs,
  field,
  graphqlFields,
  variables,
}) =>
  client.query({
    query: gql`
        query (${argsHeader}) {
          ${field} (${argsRefs}) {
            total
            totalUnfiltered
            remaining
            fromOffset
            toOffset
            totalOnPage
            totalOfPages
            currentPage
            itemsPerPage
            hasMore
            items { ${graphqlFields} }
          }
        }
      `,
    variables,
  });

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
    const state = yield select(builtSearch.selector(name));

    const {
      current,
      requestType,
      defaultSearch,
      extraArgs,
      field,
      search: oldSearch,
    } = state;

    const search = newSearch || oldSearch;

    const page = newPage || current.currentPage;
    const limit = Math.min(Math.max(current.itemsPerPage, 1), 50);

    yield put(setLoading(name, true));

    const graphqlFields = [
      "id",
      state.fields
        .filter((f) => !f.virtual)
        .map((f) => f.query || f.id)
        .join(", "),
      state.extraFields.join(", "),
    ];

    const args = [
      {
        name: "request",
        type: `${requestType}!`,
        value: {
          page,
          limit,
          sort: {},
          search: {
            ...defaultSearch,
            ...search,
          },
        },
      },
      ...extraArgs,
    ];

    const argsHeader = args.map((arg) => `$${arg.name}: ${arg.type}`).join(", ");
    const argsRefs = args.map((arg) => `${arg.name}: $${arg.name}`).join(", ");
    const variables = args.reduce(
      (variables, arg) => ({ ...variables, [arg.name]: arg.value }),
      {},
    );

    const response = yield call(querySearch, {
      argsHeader,
      argsRefs,
      field,
      graphqlFields,
      variables,
    });

    yield put(setCurrent(name, response.data[field], search));
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
