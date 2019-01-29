import { BuiltSearch } from "./index";

export default (buildSearch: BuiltSearch) => {
  const { id } = buildSearch.meta;

  return {
    SET_CURRENT: `${id}:SET_CURRENT`,
    SET_LOADING: `${id}:SET_LOADING`,
    DO_SEARCH: `${id}:DO_SEARCH`,
    SEARCH: `${id}:SEARCH`,
    DO_REGISTER: `${id}:DO_REGISTER`,
    REGISTER: `${id}:REGISTER`,
    DO_REGISTER_AND_SEARCH: `${id}:DO_REGISTER_AND_SEARCH`,
  };
};
