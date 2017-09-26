import * as Redux from "redux";
import { ACTION_TYPE_PREFIEX, ActionPayload, AutomataState, AutomataAction, PayloadAction } from "./common";

export function automataMiddleware<S>(api: Redux.MiddlewareAPI<S>): (next: Redux.Dispatch<S>) => Redux.Dispatch<S> {
    return (next: Redux.Dispatch<S>) =>
        <A extends PayloadAction<ActionPayload>>(action: A) => {
            if (!action.type.startsWith(ACTION_TYPE_PREFIEX))
                return next(action);

            let dispatching = true;

            const smAction: AutomataAction<ActionPayload> = Object.assign(action, {
                context: {
                    dispatch: <DispatchedAction extends Redux.Action>(a: DispatchedAction): DispatchedAction => {
                        if (dispatching)
                            setTimeout(() => api.dispatch(a), 0);
                        else
                            return api.dispatch(a);
                        return a;
                    }
                }
            });

            const defered = next(action);
            dispatching = false;
            return defered;
        };
}
