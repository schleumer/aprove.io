import { Global } from "@emotion/core";
import { ConnectedRouter } from "connected-react-router";
import { ThemeProvider } from "emotion-theming";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";

import FocusStealProvider from "../../core/FocusSteal/provider";
import LanguageProvider from "../../core/LanguageProvider";
import { Definition } from "../../definition";
import GlobalStyle from "../../globalStyles";
import defaultTheme from "../../theme";
import Context from "./context";

export interface Props {
  definition: Definition;
}

interface InnerProps {
  definition: Definition;
}

// /* tslint:disable */
// if (process.env.NODE_ENV !== "production") {
//   const {whyDidYouUpdate} = require("why-did-you-update");
//   whyDidYouUpdate(React);
// }
// /* tslint:enable */

class Application extends React.PureComponent<InnerProps> {
  public render() {
    const { definition } = this.props;
    const theme = definition.theme(defaultTheme);

    return (
      <ReduxProvider store={definition.store}>
        <FocusStealProvider>
          <Global styles={GlobalStyle}/>
          <LanguageProvider messages={definition.messages}>
            <ConnectedRouter history={definition.history}>
              <ThemeProvider theme={theme}>
                <div>
                  <div id="portal-target" />
                  {this.props.children}
                </div>
              </ThemeProvider>
            </ConnectedRouter>
          </LanguageProvider>
        </FocusStealProvider>
      </ReduxProvider>
    );
  }
}

class ApplicationRoot extends React.PureComponent<Props> {
  public render() {
    return (
      <Context.Provider value={this.props.definition}>
        <Application {...this.props}>
          {this.props.children}
        </Application>
      </Context.Provider>
    );
  }
}

export default ApplicationRoot;
