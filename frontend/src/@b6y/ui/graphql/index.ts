import * as R from "ramda";

import clientCreator from "./client";

class GraphQLError extends Error {
  public errors: any[] = [];
  public data: any = null;

  constructor(message, errors: any[], data: any = null) {
    super(message);

    this.errors = errors;
    this.data = data;
  }
}

interface CreateGraphQLParams {
  headers?: { [key: string]: string };
}

interface UpgradedError {
  path: string[];
  key: string;
  message: string;
  extensions: any;
}

interface GraphQLMethods {
  query(options: any): any;
  mutate(options: any): any;
  upgradeErrors(e: any, resultKey?: string): UpgradedError[];
}

export default function createGraphQL(params: CreateGraphQLParams): GraphQLMethods {
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

  const client = clientCreator(params);

  const mutate = (options) => wrap(client.mutate(options));
  const query = (options) => wrap(client.query(options));

  const upgradeErrors = (e, resultKey = "result"): UpgradedError[] => {
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
      } as UpgradedError,
    ];
  };

  return { query, mutate, upgradeErrors };
}
