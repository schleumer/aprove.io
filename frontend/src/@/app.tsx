/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import "@babel/polyfill";

// Import all the third party stuff
import { ConnectedRouter } from "connected-react-router";
import FontFaceObserver from "fontfaceobserver";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "sanitize.css/sanitize.css";

import { ThemeProvider } from "emotion-theming";

import { Global } from "@emotion/core";

import GlobalStyle from "@/global-styles";

// Import root app
import App from "@/root";

// Import Language Provider
import LanguageProvider from "@/containers/LanguageProvider";

// Load the favicon and the .htaccess file
import "!file-loader?name=[name].[ext]!./images/favicon.ico";
import "file-loader?name=.htaccess!./.htaccess"; // eslint-disable-line import/extensions

import history from "@/history";
import store from "@/store";

import theme from "@/theme";

// Import i18n messages
import { translationMessages } from "@/i18n";

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const fontObserver = new FontFaceObserver("Open Sans", {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
fontObserver.load().then(() => {
  document.body.classList.add("fontLoaded");
});

// Create redux store with history
const MOUNT_NODE = document.getElementById("app");

// tslint:disable-next-line
const icons = require("raw-loader!./icons/light.raw-svg");

const render = (messages) => {
  ReactDOM.render(
    <div>
      <Global styles={GlobalStyle} />
      <Provider store={store}>
        <LanguageProvider messages={messages}>
          <ConnectedRouter history={history}>
            <ThemeProvider theme={theme}>
              <div>
                <div id="portal-target" />
                <App />
              </div>
            </ThemeProvider>
          </ConnectedRouter>
        </LanguageProvider>
      </Provider>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: icons }} id="icons-sprite" />
    </div>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(["./i18n", "@/root"], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise((resolve) => {
    resolve(import("intl"));
  })
    .then(() =>
      Promise.all([
        import("intl/locale-data/jsonp/en.js"),
        import("intl/locale-data/jsonp/de.js"),
      ]),
    ) // eslint-disable-line prettier/prettier
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === "production") {
  // tslint:disable-next-line
  require("offline-plugin/runtime").install(); // eslint-disable-line global-require
}

// @ts-ignore
// tslint:disable-next-line
window.__utils = require("./utils");
