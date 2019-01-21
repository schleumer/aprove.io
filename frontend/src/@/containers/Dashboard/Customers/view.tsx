import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { compose } from "redux";
import {
  createStructuredSelector,
} from "reselect";

import { Loading } from "@/components/core";
import { PageBody, PageTitle } from "@/components/elite";
import { makeSelectAuth } from "@/root/selectors";

import * as actions from "./actions";
import breadcrumbs from "./breadcrumbs";
import Editor from "./editor";
import messages from "./messages";
import { makeSelectView } from "./selectors";

interface IParams {
  customerId: string;
}

interface IProps extends RouteComponentProps<IParams> {
  view: (...args: any[]) => void;
  data?: any;
}

class View extends React.Component<IProps> {
  public componentDidMount() {
    const { match, view } = this.props;

    if (match.params.customerId) {
      view({
        id: match.params.customerId,
      });
    }
  }

  public render() {
    const { data } = this.props;

    let breadcrumb = breadcrumbs.view;

    if (data) {
      breadcrumb = breadcrumb.concat({
          id: "customer.view",
          name: messages.view,
          values: { name: data.name },
          path: `/customers/${data.id}`,
      });
    }

    return (
      <Loading name="customers/view">
        {() => (
          <React.Fragment>
            <PageTitle title="meh" breadcrumb={breadcrumb} />
            <PageBody>
              <Editor data={data} />
            </PageBody>
          </React.Fragment>
        )}
      </Loading>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    view: (data) => dispatch(actions.view(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  data: makeSelectView(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(View);
