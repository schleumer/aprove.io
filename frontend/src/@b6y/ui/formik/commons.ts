import nanoid from "nanoid";

export const genid = (name, id) => {
  if (id) {
    return `${id}-${nanoid()}`;
  }

  return `${name}-${nanoid()}`;
};
