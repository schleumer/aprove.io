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

const New = (props: Props) => {
  console.log("????");
  const breadcrumb = breadcrumbs.view;

  return (
    <>
      <PageTitle title={
        <FormattedMessage {...messages.new} values={{}} />
      } breadcrumb={breadcrumb} />
      <PageBody>
        <Editor data={{}} />
      </PageBody>
    </>
  );
};

export default New;
