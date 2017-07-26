import { IAction, IAutomataState } from './common';
import * as Redux from 'redux';

export function automataMiddleware<S>(api: Redux.MiddlewareAPI<S>): (next: Redux.Dispatch<S>) => Redux.Dispatch<S> {
    return (next: Redux.Dispatch<S>) =>
        <A extends Redux.Action>(action: A) => {
            var smAction = action as IAction<S>
            if (smAction.__sm__ === undefined)
                return next(action);

            var dispatching = true;
            smAction.context = {
                dispatch: <DispatchedAction extends Redux.Action>(a: DispatchedAction) => {
                    if (dispatching)
                        setTimeout(() => api.dispatch(a));
                    else
                        return api.dispatch(a);
                }
            }
            var defered = next(<A>smAction);
            dispatching = false;
            return defered;
        };
}