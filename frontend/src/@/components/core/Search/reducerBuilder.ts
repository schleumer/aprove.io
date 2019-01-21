import produce from "immer";

import { BuiltSearch } from "./index";

import { get } from "@/utils";
import { View } from "./types";

const defaultView = (): View => ({
  env: {},
  sort: {},
  defaultSearch: {},
  search: {},
  name: "default",
  field: null,
  extraArgs: [],
  fields: [],
  requestType: null,
  auth: null,
  limit: 10,
  isLoading: false,
  current: null,
});

const initialState: View = defaultView();

const reducerBuilder = (builtSearch: BuiltSearch) => (state: View = initialState, action) =>
  produce(state, (draft) => {
    const { SET_CURRENT, SET_LOADING, REGISTER } = builtSearch.constants;
    const { data, type } = action;

    switch (type) {
      case REGISTER:
        draft[data.name] = {
          env: data.env || {},
          sort: data.sort || {},
          defaultSearch: data.defaultSearch || {},
          search: data.search || {},
          name: data.name || "default",
          extraArgs: data.extraArgs || [],
          fields: data.fields || [],
          extraFields: data.extraFields || [],
          field: data.field || null,
          requestType: data.requestType || null,
          auth: data.auth || null,
          limit: data.limit || 10,
          isLoading: data.isLoading || false,
          current: {
            total: get("current.total", data, 0),
            totalUnfiltered: get("current.totalUnfiltered", data, 0),
            remaining: get("current.remaining", data, 0),
            fromOffset: get("current.fromOffset", data, 1),
            toOffset: get("current.toOffset", data, 10),
            totalOnPage: get("current.totalOnPage", data, 0),
            totalOfPages: get("current.totalOfPages", data, 0),
            currentPage: get("current.currentPage", data, 1),
            itemsPerPage: get("current.itemsPerPage", data, 10),
            hasMore: get("current.hasMore", data, false),
            items: get("current.items", data, []),
          },
        };
        return;
      case SET_LOADING:
        draft[data.name].isLoading = data.state;
        return;
      case SET_CURRENT:
        draft[data.name].current = data.current;
        draft[data.name].search = data.search;
        draft[data.name].isLoading = false;
        return;
      default:
        return state;
    }
  });

export default reducerBuilder;
