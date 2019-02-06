import React from "react";
import hoistNonReactStatic from "hoist-non-react-statics";

import { Definition } from "../../definition";
import ApplicationContext from "../../core/Application/context";
import { Adapter, OptionType } from "../../core/SelectInput/adapter";
import clientCreator from "../client";
import { DocumentNode } from "graphql";

interface GraphQLParams {
  headers: { [key: string]: string };
}

interface GraphQLAdapterOptionsSearch {
  defaultFields: string[];
  text: string;
  props: any;
  page: number;
  limit: number;
}

interface GraphQLAdapterOptionsSingle {
  id: any;
  props: any;
}

interface GraphQLAdapterOptionsResult {
  response: any;
  props: any;
  currentPage: number;
  fromOffset: number;
  hasMore: boolean;
  items: any[];
  itemsPerPage: number;
  remaining: number;
  toOffset: number;
  total: number;
  totalOfPages: number;
  totalOnPage: number;
  totalUnfiltered: number;
}

interface GraphQLAdapterOptionsSingleResult {
  response: any;
  props: any;
  item: any;
}

interface GraphQLAdapterOptionsSingleQuery {
  query: DocumentNode;
  variables: any;
  transformResponse?: (response: any) => GraphQLAdapterOptionsSingleResult;
  transform: (item: any, a: GraphQLAdapterOptionsSingleResult) => OptionType;
}

interface GraphQLAdapterOptionsSearchQuery {
  query: DocumentNode;
  variables: any;
  transformResponse?: (response: any) => GraphQLAdapterOptionsResult;
  transform: (item: any, a: GraphQLAdapterOptionsResult) => OptionType;
}

export class GraphQLAdapterOptions {
  public searchQuery: (a: GraphQLAdapterOptionsSearch) => GraphQLAdapterOptionsSearchQuery;
  public singleQuery: (a: GraphQLAdapterOptionsSingle) => GraphQLAdapterOptionsSingleQuery;
  public limit: number = 150;
  public headers: (Definition) => { [key: string]: string };

  constructor(
    searchQuery: (a: GraphQLAdapterOptionsSearch) => GraphQLAdapterOptionsSearchQuery,
    singleQuery: (a: GraphQLAdapterOptionsSingle) => GraphQLAdapterOptionsSingleQuery,
    headers: (a: Definition) => { [key: string]: string },
    limit: number = 150,
  ) {
    this.searchQuery = searchQuery;
    this.singleQuery = singleQuery;
    this.headers = headers;
    this.limit = limit;
  }
}

export class GraphQLAdapter extends Adapter {
  public options: GraphQLAdapterOptions;
  public params: (a: GraphQLAdapterOptions) => GraphQLParams;

  constructor(options: GraphQLAdapterOptions, params: (a: GraphQLAdapterOptions) => GraphQLParams) {
    super();

    this.options = options;
    this.params = params;
  }

  public search(input: string, props: any): Promise<OptionType[]> {
    const client = clientCreator(this.params(this.options));

    const query = this.options.searchQuery({
      text: input,
      defaultFields: [
        "currentPage",
        "fromOffset",
        "hasMore",
        "itemsPerPage",
        "remaining",
        "toOffset",
        "total",
        "totalOfPages",
        "totalOnPage",
        "totalUnfiltered",
      ],
      props,
      limit: this.options.limit,
      page: 1,
    });

    const transformResponse = query.transformResponse || ((res) => {
      const result = res.data.result;

      return {
        response: res,
        props,
        currentPage: result.currentPage,
        fromOffset: result.fromOffset,
        hasMore: result.hasMore,
        items: result.items,
        itemsPerPage: result.itemsPerPage,
        remaining: result.remaining,
        toOffset: result.toOffset,
        total: result.total,
        totalOfPages: result.totalOfPages,
        totalOnPage: result.totalOnPage,
        totalUnfiltered: result.totalUnfiltered,
      };
    });

    return client.query({
      query: query.query,
      variables: query.variables,
    }).then((res) => {
      const newRes = transformResponse(res);

      return newRes.items.map((item) => query.transform(item, newRes));
    });
  }

  public single(id: any, props: any): Promise<OptionType> {
    const client = clientCreator(this.params(this.options));

    const query = this.options.singleQuery({
      id,
      props,
    });

    const transformResponse = query.transformResponse || ((res) => {
      return {
        item: res.data.result,
        response: res,
        props,
      };
    });

    return client.query({
      query: query.query,
      variables: query.variables,
    }).then((res) => {
      const newRes = transformResponse(res);

      return query.transform(newRes.item, newRes);
    });
  }
}

export const withGraphQLAdapter = <K extends string, P, S>(
  key: K,
  WrappedComponent: React.ComponentType<P & { children?: React.ReactNode } & { [P in K]: GraphQLAdapter }>,
  options: GraphQLAdapterOptions,
): React.ComponentClass<Pick<P, Exclude<keyof P, keyof { [P in K]: GraphQLAdapter }>>> => {
  class Enhance extends React.Component<P> {
    public static contextType = ApplicationContext;

    public context!: React.ContextType<typeof ApplicationContext>;

    public render() {
      const adapter = new GraphQLAdapter(options, () => ({ headers: options.headers(this.context) }));

      const props = {
        ...this.props,
        [key]: adapter,
      };

      return <WrappedComponent {...props} />;
    }
  }

  return hoistNonReactStatic(Enhance, WrappedComponent);
};
