import { RouterState } from "connected-react-router";
import * as Redux from "redux";
import { ResponseState, reducer } from "./fetch-automata";
import { automataMiddleware } from "../../src/core";

export interface ApplicationState {
  router?: RouterState;
  response: ResponseState;
}

const middlewares: Redux.Middleware[] = [automataMiddleware];
const reducers: Redux.ReducersMapObject<ApplicationState> = {
  response: reducer,
};

export { middlewares, reducers };
