import R from "ramda";

export default (value: string): string | null => {
  if (R.isNil(value)) {
    return null;
  }

  return value
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/([A-Z])/g, "-$1")
    .replace(/-+/g, "-")
    .toLowerCase();
};
