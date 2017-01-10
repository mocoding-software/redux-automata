import * as React from "react";
import * as Redux from "redux";
import * as ReactDOM from "react-dom";
import { automataMiddleware, automataReducer } from "redux-automata";

import App from "./app";
import { IResponseState, fetchAutomata } from "./fetch-automata"

const createLogger = require("redux-logger");
const AppContainer = require("react-hot-loader").AppContainer;

//constructing store
const pipeline = Redux.applyMiddleware(
    automataMiddleware, // adding automata Middleware
    createLogger()
);
const reducer = automataReducer(fetchAutomata);
const store = Redux.createStore<IResponseState>(reducer, Redux.compose(pipeline));

//run application
const mount = document.getElementById("app");
const RunApplication = () => {
    ReactDOM.render(<AppContainer><App store={store} /></AppContainer>, mount);
}
RunApplication();

//hot reload
declare var module: any;
if (module.hot) {
    module.hot.accept("./app", () => {
        require("./app");
        //re-run client        
        RunApplication();
    });
}
