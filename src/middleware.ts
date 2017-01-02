import { IAction, IAutomataState } from './common';
import * as Redux from 'redux';

export function automataMiddleware<S>(api: Redux.MiddlewareAPI<S>): (next: Redux.Dispatch<S>) => Redux.Dispatch<S> {
    return (next: Redux.Dispatch<S>) =>
        (action: Redux.Action) => {
            var smAction = action as IAction<S>
            if (smAction.__sm__ === undefined)
                return next(action);

            var dispatching = true;
            smAction.context = {
                dispatch: (a: any) => {
                    if (dispatching)
                        setTimeout(() => api.dispatch(a));
                    else
                        api.dispatch(a);
                }
            }
            var defered = next(smAction);
            dispatching = false;
            return defered;
        }
}