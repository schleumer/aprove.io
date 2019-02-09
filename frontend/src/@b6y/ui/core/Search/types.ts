import React from "react";

import { Field, Result, SortedField } from "@b6y/ui/search";

export interface BaseCellElementProps {
  env?: any;
  row?: any;
  value: any;
  field?: any;
}

export interface TypesMap {
  [key: string]: React.ComponentType<any>;
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
  fields: Field[];
  defaultSearch?: any;
  name?: string;
  env?: any;
  fontSize?: number;
  controls?: (env: any, data: any) => any;
  controlsWidth?: number;
  field?: string;
  requestType?: string;
  limit?: number;
}

export interface Props extends InnerProps, OuterProps {}

export interface State {}

export interface BuiltSearchMeta {
  id: string;
  name: string;
}

export interface View {
  name: string;
  env: any;
  defaultSearch: any;
  search: any;
  fields: Field[];
  sort: SortedField[];
  limit: number;
  isLoading: boolean;
  current: Result;
}
