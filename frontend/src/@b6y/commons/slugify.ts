import R from "ramda";
import dasherize from "./dasherize";
import latinise from "./latinise";

export default (value: string): string | null => {
  if (R.isNil(value)) {
    return null;
  }

  const newValue = dasherize(latinise(value).replace(/[^\w\s-]/g, "").toLowerCase());

  if (newValue.charAt(0) === "-") {
    return newValue.substr(1);
  }

  return newValue;
};
