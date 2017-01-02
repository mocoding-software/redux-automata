import { IAction, ActionFunction } from './common';

export function actionCreator(component: string) {

    return <TActionPayload>(type: string) => {
        var type = component + "/" + type;

        var func: ActionFunction<TActionPayload> = (payload: TActionPayload) => {
            let action: IAction<TActionPayload> = {
                __sm__: component,
                type: type,
                payload: payload
            };
            return action;
        }

        func.actionType = type;
        return func;
    }      
}