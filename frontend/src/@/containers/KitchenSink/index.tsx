import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router";

interface Props extends RouteComponentProps<any> {}

import Components from "./components";
import Scroll from "./scroll";

export class KitchenSink extends React.Component<Props> {
  public render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/scroll`} component={Scroll} />
        <Route path={`${match.path}/components`} component={Components} />
        <Route path={`${match.path}`} exact component={Components} />
      </Switch>
    );
  }
}

export default KitchenSink;
