import "whatwg-fetch";

import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";

import store from "@/store";

import { DefaultOptions } from "apollo-client/ApolloClient";

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

  const state = store.getState();

  const { token } = state.global.auth;

  const newHeaders = {
    ...headers,
    XFromApollo: true,
  };

  if (token) {
    newHeaders.Authorization = `Bearer ${token}`;
  }

  return {
    headers: newHeaders,
  };
});

const client = new ApolloClient({
  link: auth.concat(http),
  cache: new InMemoryCache(),
  defaultOptions,
});

export default client;
