import { BuiltSearch } from "./index";

export default (buildSearch: BuiltSearch) => ({
  register(data) {
    return {
      type: buildSearch.constants.DO_REGISTER,
      data,
    };
  },
  search(name, search = {}, params = { page: 1 }) {
    return {
      type: buildSearch.constants.DO_SEARCH,
      data: { name, search, params },
    };
  },
  setCurrent(name, current, search: any = {}) {
    return {
      type: buildSearch.constants.SET_CURRENT,
      data: { name, current, search },
    };
  },
  setLoading(name, state) {
    return {
      type: buildSearch.constants.SET_LOADING,
      data: { name, state },
    };
  },
  registerAndSearch(component, search, params) {
    return {
      type: buildSearch.constants.DO_REGISTER_AND_SEARCH,
      data: { component, search, params },
    };
  },
});
