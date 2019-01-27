import client from "@/utils/client";
import * as R from "ramda";
// import store from "@/store";

class GraphQLError extends Error {
  public errors: any[] = [];
  public data: any = null;

  constructor(message, errors: any[], data: any = null) {
    super(message);

    this.errors = errors;
    this.data = data;
  }
}

const wrap = (promise) =>
  promise
    .catch((ex) => {
      throw new GraphQLError(
        "Request failed",
        R.pathOr([], ["networkError", "result", "errors"], ex),
      );
    })
    .then((res) => {
      if (res.errors && res.errors.length > 0) {
        const newEx = new GraphQLError("Request failed", res.errors, res.data);
        throw newEx;
      }
      return res;
    });

export const mutate = (options) => wrap(client.mutate(options));
export const query = (options) => wrap(client.query(options));

export const upgradeErrors = (e, resultKey = "result") => {
  console.log([e]);
  if (e instanceof GraphQLError) {
    return e.errors.map((x) => {
      let path = null;

      if (x.path) {
        const [head] = x.path;
        let [, ...localPath] = x.path;

        if (head !== resultKey) {
          localPath = [head, ...localPath];
        }

        localPath = ["$", ...localPath];

        path = localPath;
      } else {
        path = ["$"];
      }

      return {
        path,
        key: path.join("."),
        message: x.message,
        extensions: x.extensions || {},
      };
    });
  }

  return [
    {
      path: ["$"],
      key: "$",
      message: e.message,
      extensions: {},
    },
  ];
};
