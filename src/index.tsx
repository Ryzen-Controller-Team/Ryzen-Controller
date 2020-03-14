import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";

const UIkit = require("uikit");
const Icons = require("uikit/dist/js/uikit-icons");
UIkit.use(Icons);

const rootEl = document.getElementById("root");
ReactDOM.render(<App />, rootEl);

// For hot reload
// See https://github.com/vitaliy-bobrov/angular-hot-loader/issues/5#issuecomment-377785900
if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
