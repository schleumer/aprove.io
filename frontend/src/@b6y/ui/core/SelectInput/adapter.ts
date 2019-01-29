import { client } from "@/utils";
import R from "ramda";
import React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";
import S from "string";

interface OptionType {
  label: string | FormattedMessage.MessageDescriptor;
  value: any;
  option?: React.ReactNode;
}

interface SearchableOptionType {
  text: string;
}

export abstract class Adapter {
  public abstract search(input: string, props: any): Promise<OptionType[]>;

  public abstract single(id: any, props: any): Promise<OptionType>;
}

interface RemoteGraphQLOptionsSearch {
  defaultFields: string[];
  text: string;
  props: any;
  page: number;
  limit: number;
}

interface RemoteGraphQLOptionsSingle {
  id: any;
  props: any;
}

interface RemoteGraphQLOptionsResult {
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

interface RemoteGraphQLOptionsSingleResult {
  response: any;
  props: any;
  item: any;
}

interface RemoteGraphQLOptionsSingleQuery {
  query: string;
  variables: any;
  transformResponse?: (response: any) => RemoteGraphQLOptionsSingleResult;
  transform: (item: any, a: RemoteGraphQLOptionsSingleResult) => OptionType;
}

interface RemoteGraphQLOptionsSearchQuery {
  query: string;
  variables: any;
  transformResponse?: (response: any) => RemoteGraphQLOptionsResult;
  transform: (item: any, a: RemoteGraphQLOptionsResult) => OptionType;
}

export class RemoteGraphQLOptions extends Adapter {
  protected searchQuery: (a: RemoteGraphQLOptionsSearch) => RemoteGraphQLOptionsSearchQuery;
  protected singleQuery: (a: RemoteGraphQLOptionsSingle) => RemoteGraphQLOptionsSingleQuery;
  protected limit: number = 150;

  constructor(
    searchQuery: (a: RemoteGraphQLOptionsSearch) => RemoteGraphQLOptionsSearchQuery,
    singleQuery: (a: RemoteGraphQLOptionsSingle) => RemoteGraphQLOptionsSingleQuery,
    limit: number = 150,
  ) {
    super();

    this.searchQuery = searchQuery;
    this.singleQuery = singleQuery;
    this.limit = limit;
  }

  public search(input: string, props: any): Promise<OptionType[]> {
    const query = this.searchQuery({
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
      limit: this.limit,
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
    const query = this.singleQuery({
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

export class ArrayOptions extends Adapter {
  protected options: Array<OptionType & SearchableOptionType>;

  constructor(
    options: OptionType[],
  ) {
    super();

    this.options = options.map((o) => {
      if (!R.is(Object, o.label)) {
        return { ...o, text: S(o.label).latinise().s };
      } else {
        return { ...o, text: "NOT_TRANSLATED" };
      }
    });
  }

  public intl(intl: InjectedIntl) {
    const translatedOptions = this.options.map((o) => {
      if (!R.is(Object, o.label)) {
        return { ...o, text: S(o.label).latinise().s };
      } else {
        const label = intl.formatMessage(o.label as FormattedMessage.MessageDescriptor);
        return { ...o, label, text: S(label).latinise().s };
      }
    });
    return new ArrayOptions(translatedOptions);
  }

  public search(input: string, props: any): Promise<OptionType[]> {
    return new Promise((resolve) => {
      if (R.isNil(input) || input === "") {
        resolve(this.options);
      } else {
        const text = S(input).latinise().s;
        resolve(
          this.options.filter((o) => o.text.includes(text)),
        );
      }
    });
  }

  public single(id: any, props: any): Promise<OptionType> {
    return new Promise((resolve) => {
      resolve(this.options.find((o) => o.value === id) || null);
    });
  }
}
