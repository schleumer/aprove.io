import "whatwg-fetch";

import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { DefaultOptions } from "apollo-client/ApolloClient";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";

interface CreateClientParams {
  headers?: { [key: string]: string };
}

export type GraphQLClient = ApolloClient<any>;

export default (params: CreateClientParams) => {
  const defaultOptions: DefaultOptions = {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    },
    mutate: {
      errorPolicy: "all",
    },
  };

  const http = createHttpLink({
    uri: process.env.GRAPHQL_ENDPOINT,
  });

  const auth = setContext((p1, p2) => {
    const { headers } = p2;

    const newHeaders = {
      ...headers,
      XFromApollo: true,
      ...(params.headers || {}),
    };

    return {
      headers: newHeaders,
    };
  });

  return new ApolloClient({
    link: auth.concat(http),
    cache: new InMemoryCache(),
    defaultOptions,
  });
};
