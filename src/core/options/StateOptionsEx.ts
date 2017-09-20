import {
    IActionFunction,
    IActionOptions,
    IStateFunction,
    IStateMachineOptions,
    IStateOptions,
    IStateOptionsEx,
} from "../common";

export class StateOptionsEx<TState> implements IStateOptionsEx<TState> {

    constructor(
        private options: IStateMachineOptions<TState>,
        private stateOptions: IStateOptions<TState>) { }

    public In(state: IStateFunction<TState, any>): IStateOptions<TState> {
        return this.options.In(state);
    }

    public InAny(): IStateOptions<TState> {
        return this.options.InAny();
    }

    public On<TAction>(actionFunc: IActionFunction<TAction>): IActionOptions<TState, TAction> {
        return this.stateOptions.On(actionFunc);
    }
}
