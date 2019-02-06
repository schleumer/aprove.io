import React from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps } from "react-router-dom";

import { PageBody, PageTitle } from "@/components/elite";
import { LoadingIndicator } from "@b6y/ui/core";

import * as graphql from "@/hooks/graphql";

import breadcrumbs from "./breadcrumbs";
import Editor from "./editor";
import { viewQuery } from "./graphql";
import messages from "./messages";

interface Params {
  customerId: string;
}

interface Props extends RouteComponentProps<Params> {}

const View = (props: Props) => {
  const { match } = props;

  const [response, state] = graphql.query(match.params.customerId, "result", {
    query: viewQuery,
    variables: {
      id: parseInt(match.params.customerId, 0),
    },
  });

  if (state === graphql.states.running) {
    return <LoadingIndicator />;
  }

  if (state === graphql.states.failed) {
    return <b>Failed</b>;
  }

  const { result } = response;

  let breadcrumb = breadcrumbs.view;

  if (result) {
    breadcrumb = breadcrumb.concat({
        id: "customer.view",
        name: messages.view,
        values: result,
        path: `/customers/${result.id}`,
    });
  }

  return (
    <>
      <PageTitle title={
        <FormattedMessage {...messages.view} values={result} />
      } breadcrumb={breadcrumb} />
      <PageBody>
        <Editor data={result} />
      </PageBody>
    </>
  );
};

export default View;
