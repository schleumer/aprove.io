import { IS_SUBMITTING, REGISTER } from "./constants";

export function register(name) {
  return {
    type: REGISTER,
    data: name,
  };
}

export function isSubmitting(name, state) {
  return {
    type: IS_SUBMITTING,
    data: { name, state },
  };
}
