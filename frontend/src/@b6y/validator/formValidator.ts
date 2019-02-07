import * as localize from "ajv-i18n/localize/pt-BR";
import * as R from "ramda";
import ajv from "./ajv";

// const messages = {
//   pattern: 'Formato incorreto',
// };

export default function formValidator(data, schema) {
  const $schema = {
    ...schema,
    $async: true,
  };

  const validator = ajv.compile($schema);

  const result = validator(data) as Promise<any>;

  return result.then((r) => {
    return { valid: true, errors: [], data: r };
  }).catch((e) => {
    localize(e.errors);

    const errors = e.errors.reduce((result, e) => {
      const key = e.dataPath.replace(/^\./, "");

      const value = R.append(
        e.message,
        R.propOr([], key, result),
      );

      return {
        ...result,
        [key]: value,
      };
    }, []);

    return {
      valid: false,
      errors,
      data: null,
    };
  });
}
