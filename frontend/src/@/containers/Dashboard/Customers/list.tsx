import { makeSelectAuth } from "@/root/selectors";
import gql from "graphql-tag";
import R from "ramda";
import React from "react";

import { FastField, Form, Formik } from "formik";
import produce from "immer";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { compose } from "redux";
import * as yup from "yup";

import {
  BoxGroup,
  Button,
  ButtonOutline,
  Icon,
  Padding,
} from "@b6y/ui/core";
import search from "@b6y/ui/core/Search";
import Tooltip from "@b6y/ui/core/Tooltip";
import { TextInput } from "@b6y/ui/formik";
import Channel from "@b6y/ui/formik/Channel";
import {
  RouterButton,
  RouterButtonOutline,
} from "@b6y/ui/router";
import { Box } from "@b6y/ui/styled";

import {
  PageBody,
  PageTitle,
} from "@/components/elite";
import graphQLCreator, { GraphQLMethods } from "@b6y/ui/graphql";
import { Adapter, Field, Query, ResponseError, Result } from "@b6y/ui/search";

import breadcrumbs from "./breadcrumbs";

import messages from "./messages";

const searchSchema = yup.object().shape({
  code: yup.number(),
  name: yup.string(),
});

const searchFields: Field[] = [
  { id: "code", name: messages.code, width: 40 },
  { id: "name", name: messages.name, width: 100 },
  {
    id: "email",
    name: messages.email,
    width: 40,
    fields: [
      { id: "email" },
    ],
    path: "email.email",
  },
  {
    id: "phone",
    name: messages.phone,
    width: 40,
    fields: [
      { id: "phone" },
    ],
    path: "phone.phone",
    type: "phone",
  },
];

interface ExtraArg {
  name: string;
  type: string;
  value: any;
}

interface SearchGraphQLAdapterParams {
  field: string;
  requestType: string;
  extraArgs?: (adapterParams: SearchGraphQLAdapterParams, query: Query, globalState: any, env: any) => ExtraArg[];
}

const buildQuery = R.memoizeWith((...args) => {
  return args.join("👌");
}, (field, argsHeader, argsRefs, queryableFields) => {
  return gql`
    query (${argsHeader}) {
      result: ${field} (${argsRefs}) {
        total
        totalUnfiltered
        remaining
        fromOffset
        toOffset
        totalOnPage
        totalOfPages
        currentPage
        itemsPerPage
        hasMore
        items { ${queryableFields} }
      }
    }`;
});

const SearchGraphQLAdapter = (params: SearchGraphQLAdapterParams): Adapter => ({
  run(query: Query, globalState: any, env: any = {}): Promise<Result> {
    console.time("SearchGraphQLAdapter.run");

    console.time("SearchGraphQLAdapter.run1");
    const auth = makeSelectAuth()(globalState);
    console.timeEnd("SearchGraphQLAdapter.run1");

    const extraArgs = (params.extraArgs && params.extraArgs(params, query, globalState, env)) || [];

    let methods: GraphQLMethods = null;

    console.time("SearchGraphQLAdapter.run2");
    if (auth.token) {
      methods = graphQLCreator({ headers: { Authorization: `Bearer ${auth.token}` } });
    } else {
      methods = graphQLCreator({});
    }
    console.timeEnd("SearchGraphQLAdapter.run2");

    console.time("SearchGraphQLAdapter.run3");
    const fieldsToGraphQL = (fields: Field[]): string => {
      return fields.map((field) => {
        if (field.fields && field.fields.length > 0) {
          return `${field.id} { ${fieldsToGraphQL(field.fields)} }`;
        } else {
          return field.id;
        }
      }).join(", ");
    };

    const queryableFields = fieldsToGraphQL([{ id: "id" }].concat(
      query.fields
        .filter((f) => !f.virtual),
    ));
    console.timeEnd("SearchGraphQLAdapter.run3");

    const args = [
      {
        name: "request",
        type: `${params.requestType}!`,
        value: {
          page: query.page,
          limit: query.limit,
          sort: {},
          search: query.search,
        },
      },
      ...extraArgs,
    ];

    const argsHeader = args.map((arg) => `$${arg.name}: ${arg.type}`).join(", ");
    const argsRefs = args.map((arg) => `${arg.name}: $${arg.name}`).join(", ");
    const variables = args.reduce(
      (variables, arg) => ({ ...variables, [arg.name]: arg.value }),
      {},
    );

    return methods.query<any>("result", {
      query: buildQuery(params.field, argsHeader, argsRefs, queryableFields),
      variables,
    }).then((res) => {
      if (res.errors && res.errors.length > 0) {
        throw new ResponseError(res.errors);
      }

      const { result } = res;

      console.timeEnd("SearchGraphQLAdapter.run");

      return {
        total: result.total,
        totalUnfiltered: result.totalUnfiltered,
        remaining: result.remaining,
        fromOffset: result.fromOffset,
        toOffset: result.toOffset,
        totalOnPage: result.totalOnPage,
        totalOfPages: result.totalOfPages,
        currentPage: result.currentPage,
        itemsPerPage: result.itemsPerPage,
        hasMore: result.hasMore,
        items: result.items,
      } as Result;
    });
  },
});

const Search = search("customers", SearchGraphQLAdapter({
  field: "customers",
  requestType: "CustomersRequest",
}));

const CustomerSearchForm = ({ isSubmitting }) => (
  <Form>
    <BoxGroup spacing={2} mb={3}>
      <Box>
        <FastField
          name="code"
          component={TextInput}
          placeholder={messages.code}
        />
      </Box>
      <Box>
        <FastField
          name="name"
          component={TextInput}
          placeholder={messages.name}
        />
      </Box>
      <Box>
        <Button state="primary" disabled={isSubmitting} type="submit">
          <FormattedMessage {...messages.search} />
        </Button>
      </Box>
    </BoxGroup>
  </Form>
);

interface IProps {
  isSubmitting: (...args: any[]) => void;
  search: (...args: any[]) => void;
}

class List extends React.PureComponent<IProps> {
  public form?: React.RefObject<any>;

  constructor(props) {
    super(props);

    this.renderControls = this.renderControls.bind(this);
    this.submit = this.submit.bind(this);

    this.form = React.createRef();
  }

  public renderControls(env, { rowData }) {
    return (
      <Padding
        style={{ padding: "4px", display: "flex", alignItems: "center" }}
      >
        <RouterButtonOutline to={`/customers/${rowData.id}`} size="sm" px={2} state="info">
          <Icon name="pencil" />
          <span>Editar</span>
        </RouterButtonOutline>
        <ButtonOutline size="sm" px={2} state="primary">
          <Icon name="file" />
          <span>Criar Proposta</span>
        </ButtonOutline>
        <Tooltip text="Remover" position="top">
          <ButtonOutline size="sm" px={2} state="danger">
            <Icon name="trash-alt" />
          </ButtonOutline>
        </Tooltip>
      </Padding>
    );
  }

  public submit(data) {
    this.props.isSubmitting(false);

    const searchData = produce({}, (draft: any) => {
      if (data.code) {
        draft.codeOp = { eq: data.code };
      }

      if (data.name) {
        draft.nameOp = { contains: data.name };
      }

      if (data.id && !Number.isNaN(data.id)) {
        draft.id = parseInt(data.id, 10);
      }
    });

    this.props.search("default", searchData);
  }

  public render() {
    return (
      <div>
        <PageTitle title="Clientes" breadcrumb={breadcrumbs.list}>
          <RouterButton to={`/customers/new`} size="sm" px={2} state="primary">
            <Icon size={16} name="plus-circle"/>
            <span><FormattedMessage {...messages.new} /></span>
          </RouterButton>
        </PageTitle>
        <PageBody>
          <Channel name="customers/list">
            <Formik
              ref={this.form}
              initialValues={{
                id: "",
                code: "",
                name: "",
              }}
              onSubmit={this.submit}
              render={(props) => <CustomerSearchForm {...props} />}
              validationSchema={searchSchema}
              validateOnChange={false}
              validateOnBlur={false}
            />
          </Channel>
          <div style={{ height: "100%" }}>
            <Search.Component
              limit={50}
              fields={searchFields}
              controls={this.renderControls}
              controlsWidth={300}
            />
          </div>
        </PageBody>
      </div>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    isSubmitting: (state) =>
      dispatch(Channel.actions.isSubmitting("customers/list", state)),
    search: (name, searchData, searchParams) =>
      dispatch(Search.actions.search(name, searchData, searchParams)),
  };
}

const withConnect = connect(
  () => ({}),
  mapDispatchToProps,
);

export default compose(withConnect)(List);
