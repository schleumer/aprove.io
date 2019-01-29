import React from "react";
import { FormattedMessage } from "react-intl";

export interface BaseCellElementProps {
  env?: any;
  row?: any;
  value: any;
  field?: any;
}

export interface TypesMap {
  [key: string]: React.ReactNode;
}

export interface SearchExtraArg {
  type: string;
  value: any;
  name: string;
}

export interface SearchField {
  id?: string;
  name?: string | FormattedMessage.MessageDescriptor;
  width?: number;
  type?: string;
  virtual?: boolean;
  query?: string;
  path?: string;
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
  extraArgs?: SearchExtraArg[];
  defaultSearch?: any;
  env?: any;
  fontSize?: number;
  controls?: (env: any, data: any) => any;
  controlsWidth?: number;
  field?: string;
  requestType?: string;
  fields: SearchField[];
  extraFields?: string[];
  limit?: number;
}

export interface Props extends InnerProps, OuterProps {}

export interface State {}

export interface BuiltSearchMeta {
  id: string;
  name: string;
}

export interface CurrentView {
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

export interface View {
  env: any;
  sort: any;
  defaultSearch: any;
  search: any;
  name: string;
  field: string;
  extraArgs: string[];
  fields: SearchField[];
  requestType: string;
  auth: {
    token: string;
  };
  limit: number;
  isLoading: boolean;
  current: CurrentView;
}
