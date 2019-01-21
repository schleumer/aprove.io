import R from "ramda";

export default (path: string, obj: any, defaultValue?: any) =>
  R.pathOr(defaultValue, path.split("."), defaultValue);
