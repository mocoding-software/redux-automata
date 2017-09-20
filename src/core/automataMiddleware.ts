import * as Redux from "redux";
import { AutomataState, IAction } from "./common";

export function automataMiddleware<S>(api: Redux.MiddlewareAPI<S>): (next: Redux.Dispatch<S>) => Redux.Dispatch<S> {
    return (next: Redux.Dispatch<S>) =>
        <A extends Redux.Action>(action: A) => {
            const smAction = action as IAction<S>;
            if (smAction.__sm__ === undefined)
                return next(action);

            let dispatching = true;
            smAction.context = {
                dispatch: <DispatchedAction extends Redux.Action>(a: DispatchedAction) => {
                    if (dispatching)
                        setTimeout(() => api.dispatch(a), 0);
                    else
                        return api.dispatch(a);
                }
            };
            const defered = next(smAction as A);
            dispatching = false;
            return defered;
        };
}
