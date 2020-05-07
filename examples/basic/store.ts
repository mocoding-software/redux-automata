import { RouterState } from "connected-react-router";
import * as Redux from "redux";
import { SwitcherState, reducer } from "./basic-automata";
import { automataMiddleware } from "../../src/core";

export interface ApplicationState {
  router?: RouterState;
  switcher: SwitcherState;
}

const middlewares: Redux.Middleware[] = [ automataMiddleware ];
const reducers: Redux.ReducersMapObject<ApplicationState> = {
  switcher: reducer,
};

export { middlewares, reducers };
