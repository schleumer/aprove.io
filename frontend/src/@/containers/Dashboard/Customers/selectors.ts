import { createSelector } from "reselect";

const selectInstances = (state) => state.instances;

const makeSelectView = () =>
  createSelector(selectInstances, (state) => state && state.view);

export { makeSelectView };
