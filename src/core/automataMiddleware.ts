import * as Redux from "redux";
import { ACTION_TYPE_PREFIX, ActionPayload, PayloadAction } from "./common";

export function automataMiddleware<D extends Redux.Dispatch, S>(
  api: Redux.MiddlewareAPI<D, S>,
): (next: Redux.Dispatch) => Redux.Dispatch {
  return (next: Redux.Dispatch) =>
    <A extends PayloadAction<ActionPayload>>(action: A) => {
      if (!action.type.startsWith(ACTION_TYPE_PREFIX)) return next(action);

      let dispatching = true;

      Object.assign(action, {
        dispatch: <DispatchedAction extends Redux.Action>(a: DispatchedAction): DispatchedAction => {
          if (dispatching) setTimeout(() => api.dispatch(a), 0);
          else return api.dispatch(a);
          return a;
        },
      });

      const deferred = next(action);
      dispatching = false;
      return deferred;
    };
}
