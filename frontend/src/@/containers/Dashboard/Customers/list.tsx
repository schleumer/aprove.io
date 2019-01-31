import React from "react";

import { FastField, Form, Formik } from "formik";
import produce from "immer";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { FormattedMessage } from "react-intl";
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
  RouterButtonOutline,
} from "@b6y/ui/router";
import { Box } from "@b6y/ui/styled";

import {
  PageBody,
  PageTitle,
} from "@/components/elite";

import breadcrumbs from "./breadcrumbs";

import messages from "./messages";

const searchSchema = yup.object().shape({
  code: yup.number(),
  name: yup.string(),
});

const searchFields = [
  { id: "code", name: messages.code, width: 40 },
  { id: "name", name: messages.name, width: 100 },
  {
    id: "email",
    name: messages.email,
    width: 40,
    query: "email { email }",
    path: "email.email",
  },
  {
    id: "phone",
    name: messages.phone,
    width: 40,
    query: "phone { phone }",
    path: "phone.phone",
    type: "phone",
  },
];

const Search = search("customers");

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

class List extends React.Component<IProps> {
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
        <PageTitle title="Clientes" breadcrumb={breadcrumbs.list} />
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
              field="customers"
              limit={50}
              requestType="CustomersRequest"
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

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(List);
