// Needed for redux-saga es6 generator support
import "@babel/polyfill";

// Import all the third party stuff
import FontFaceObserver from "fontfaceobserver";
import React from "react";
import ReactDOM from "react-dom";
import "sanitize.css/sanitize.css";

import Application from "@b6y/ui/core/Application";
import definition from "@b6y/ui/definition";

import { translationMessages } from "@/i18n";
import App from "@/root";
import history from "@/history";

import rootReducer from "./root/reducer";

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const fontObserver = new FontFaceObserver("Open Sans", {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
fontObserver.load().then(() => {
  document.body.classList.add("fontLoaded");
});

const MOUNT_NODE = document.getElementById("app");

// tslint:disable-next-line
const icons = require("raw-loader!./icons/light.raw-svg");

const app = definition({
  history,
  reducers: { global: rootReducer },
});

const render = (messages) => {
  ReactDOM.render(
    <div>
      <Application definition={{...app, messages}}>
        <App />
      </Application>
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

// Load the favicon and the .htaccess file
import "!file-loader?name=[name].[ext]!./images/favicon.ico";
import "file-loader?name=.htaccess!./.htaccess"; // eslint-disable-line import/extensions
