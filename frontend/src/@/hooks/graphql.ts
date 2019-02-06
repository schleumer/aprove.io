import { useContext, useEffect, useMemo, useReducer } from "react";

import ApplicationContext from "@b6y/ui/core/Application/context";
import graphQLCreator, { GraphQLMethods, MutateOptions, QueryOptions, Response } from "@b6y/ui/graphql";

import { makeSelectAuth } from "@/root/selectors";

export const useGraphQLMethods = (): GraphQLMethods => {
  const app = useContext(ApplicationContext);
  const state = app.store.getState();
  const auth = makeSelectAuth()(state);

  return useMemo(() => {
    return graphQLCreator({ headers: { Authorization: `Bearer ${auth.token}` }});
  }, auth);
};

type ValueOf<T> = T[keyof T];

export const states = {
  running: Symbol("running"),
  failed: Symbol("failed"),
  successful: Symbol("successful"),
};

export const actions = {
  running: Symbol("running"),
  done: Symbol("done"),
};

function reducer(state, action) {
  switch (action.type) {
    case actions.running:
      return {
        result: null,
        state: states.running,
      };

    case actions.done:
      if (action.payload.successful) {
        return {
          result: action.payload,
          state: states.successful,
        };
      } else {
        return {
          result: action.payload,
          state: states.failed,
        };
      }

    default:
      return state;
  }
}

export function mutate<TResponse = any>(
  cacheId: string | number,
  resultKey: string,
  options: MutateOptions,
): [Response<TResponse> | null, ValueOf<typeof states>] {
  const methods = useGraphQLMethods();

  const [{ result, state }, dispatch] = useReducer(reducer, {
    result: null,
    state: states.running,
  });

  useEffect(() => {
    const promise = methods.mutate<TResponse>(resultKey, options);

    let canceled = false;

    promise.then(
      (response) => !canceled && dispatch({
        payload: response,
        type: actions.done,
      }),
      (error) => !canceled && dispatch({
        payload: {
          errors: [{extensions: null, key: "$", message: error.message, path: ["$"]}],
          result: null,
          successful: false,
        } as Response<TResponse>,
        type: states.failed,
      }),
    );

    return () => {
      canceled = true;
    };
  }, [cacheId]);

  return [result, state];
}

export function query<TResponse = any>(
  cacheId: string | number,
  resultKey: string,
  options: QueryOptions,
): [Response<TResponse> | null, ValueOf<typeof states>] {
  const methods = useGraphQLMethods();

  const [{ result, state }, dispatch] = useReducer(reducer, {
    result: null,
    state: states.running,
  });

  useEffect(() => {
    const promise = methods.query<TResponse>(resultKey, options);

    let canceled = false;

    promise.then(
      (response) => !canceled && dispatch({
        payload: response,
        type: actions.done,
      }),
      (error) => !canceled && dispatch({
        payload: {
          errors: [{extensions: null, key: "$", message: error.message, path: ["$"]}],
          result: null,
          successful: false,
        } as Response<TResponse>,
        type: states.failed,
      }),
    );

    return () => {
      canceled = true;
    };
  }, [cacheId]);

  return [result, state];
}
