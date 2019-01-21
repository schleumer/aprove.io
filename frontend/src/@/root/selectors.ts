import { createSelector } from "reselect";

const selectGlobal = (state) => state.global;

const selectRoute = (state) => state.route;

const makeSelectLoading = () =>
  createSelector(selectGlobal, (globalState) => globalState.loading);

const makeSelectError = () =>
  createSelector(selectGlobal, (globalState) => globalState.error);

const makeSelectAuth = () =>
  createSelector(selectGlobal, (globalState) => globalState.auth);

const makeSelectLocation = () =>
  createSelector(selectRoute, (routeState) => routeState.location);

export {
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
  makeSelectAuth,
};
