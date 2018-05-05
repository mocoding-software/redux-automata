import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import { automataMiddleware } from "redux-automata";

import App from "./app";
import { reducer, State } from "./basic-automata";

const createLogger = require("redux-logger").createLogger;
const AppContainer = require("react-hot-loader").AppContainer;

// constructing store
const pipeline = Redux.applyMiddleware(
    automataMiddleware, // adding automata Middleware
    createLogger()
);
const store = Redux.createStore(reducer, Redux.compose(pipeline));

// run application
const mount = document.getElementById("app");
const RunApplication = () => {
    ReactDOM.render(<AppContainer><App store={store} /></AppContainer>, mount);
}
RunApplication();

// hot reload
declare var module: any;
if (module.hot) {
    module.hot.accept("./app", () => {
        require("./app");
        // re-run client
        RunApplication();
    });
}
