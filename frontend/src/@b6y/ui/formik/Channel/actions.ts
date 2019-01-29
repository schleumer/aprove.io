import { IS_SUBMITTING, REGISTER } from "./constants";

export function register(name: string) {
  return {
    type: REGISTER,
    data: name,
  };
}

export function isSubmitting(name: string, state: boolean) {
  return {
    type: IS_SUBMITTING,
    data: { name, state },
  };
}
