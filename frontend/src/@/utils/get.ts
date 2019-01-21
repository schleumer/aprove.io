import R from "ramda";

export default (path: string, obj: any, _default?: any) =>
  R.pathOr(_default, path.split("."), _default);
