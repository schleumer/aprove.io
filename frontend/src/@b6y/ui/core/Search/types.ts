import React from "react";
import { FormattedMessage } from "react-intl";

export interface BaseCellElementProps {
  env?: any;
  row?: any;
  value: any;
  field?: any;
}

export interface TypesMap {
  [key: string]: React.ComponentType<any>;
}

export interface SearchField {
  id: string;
  name?: string | FormattedMessage.MessageDescriptor;
  width?: number;
  type?: string;
  virtual?: boolean;
  query?: string;
  path?: string;
  fields?: SearchField[];
}

export interface InnerProps {
  auth: {
    token: string;
  };
  searchStore: any;
  search: (...args: any[]) => void;
  registerAndSearch: (...args: any[]) => void;
}

export interface OuterProps {
  name?: string;
  defaultSearch?: any;
  env?: any;
  fontSize?: number;
  controls?: (env: any, data: any) => any;
  controlsWidth?: number;
  field?: string;
  requestType?: string;
  fields: SearchField[];
  limit?: number;
}

export interface Props extends InnerProps, OuterProps {}

export interface State {}

export interface BuiltSearchMeta {
  id: string;
  name: string;
}

export interface CurrentResult {
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

export interface SortedField {
  name: string;
  priority: number;
  order: 1 | 0 | -1;
}

export interface View {
  name: string;
  env: any;
  sort: SortedField[];
  defaultSearch: any;
  search: any;
  endpoint: string;
  fields: SearchField[];
  limit: number;
  isLoading: boolean;
  current: CurrentResult;
}
