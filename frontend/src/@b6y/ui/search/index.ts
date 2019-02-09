import { FormattedMessage } from "react-intl";

import * as error from "@b6y/error";

export interface SortedField {
  name: string;
  priority: number;
  order: 1 | 0 | -1;
}

export interface Field {
  id: string;
  name?: string | FormattedMessage.MessageDescriptor;
  width?: number;
  type?: string;
  virtual?: boolean;
  path?: string;
  fields?: Field[];
}

export interface Result {
  total: number;
  totalUnfiltered: number;
  remaining: number;
  fromOffset: number;
  toOffset: number;
  totalOnPage: number;
  totalOfPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;
  items: any[];
}

export interface Query {
  fields: Field[];
  sort: SortedField[];
  page: number;
  limit: number;
  search: any;
  previousSearch: any;
}

export class ResponseError extends Error {
  public errors: ReadonlyArray<error.Error>;
  constructor(errors: ReadonlyArray<error.Error>) {
    super("Request failed");

    this.errors = errors;
  }
}

export interface Adapter {
  run(query: Query, state: any, env: any): Promise<Result>;
}
