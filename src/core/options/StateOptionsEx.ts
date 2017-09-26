import {
    ActionDefinition,
    ActionFluentOptions,
    StateDefinition,
    StateMachineOptions,
    StateFluentOptions,
    StateFluetOptionsEx,
} from "../common";

export class StateOptionsEx<TState> implements StateFluetOptionsEx<TState> {
    constructor(
        private options: StateMachineOptions<TState>,
        private stateOptions: StateFluentOptions<TState>) { }

    public in(state: StateDefinition<TState, any>): StateFluentOptions<TState> {
        return this.options.in(state);
    }

    public on<TAction>(actionFunc: ActionDefinition<TAction>): ActionFluentOptions<TState, TAction> {
        return this.stateOptions.on(actionFunc);
    }
}
