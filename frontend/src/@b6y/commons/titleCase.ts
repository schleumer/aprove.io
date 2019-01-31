import R from "ramda";

export default (value: string): string | null => {
  if (R.isNil(value)) {
    return null;
  }

  return value.replace(
    /(^[a-z]| [a-z]|-[a-z]|_[a-z])/g,
    ($1) => $1.toUpperCase(),
  );
};
