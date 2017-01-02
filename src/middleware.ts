import { IAction, IAutomataState } from './common';
import * as Redux from 'redux';

const automataMiddleware: Redux.Middleware =
    <S>(api: Redux.MiddlewareAPI<S>) =>
        (next: Redux.Dispatch<S>) =>
            (action: Redux.Action) => {
                var smAction = action as IAction<S>
                if (smAction.__sm__ === undefined)
                    return next(action);
                
                var dispatching = true;
                smAction.context = {
                    dispatch: (a: any) => { 
                        if (dispatching) 
                            setTimeout(()=>api.dispatch(a));
                        else
                            api.dispatch(a);
                    }
                }
                var defered = next(smAction);
                dispatching = false;
                return defered;
            }

export default automataMiddleware;