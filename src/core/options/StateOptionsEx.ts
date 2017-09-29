import {
    ActionDefinition,
    ActionFluentOptions,
    ActionPayload,
    StateDefinition,
    StateFluentOptions,
    StateFluetOptionsEx,
    StateMachineOptions
} from "../common";

export class StateOptionsEx<TState> implements StateFluetOptionsEx<TState> {
    constructor(
        private options: StateMachineOptions<TState>,
        private stateOptions: StateFluentOptions<TState>) { }

    public in<TPayload extends ActionPayload>(state: StateDefinition<TState, TPayload>): StateFluentOptions<TState> {
        return this.options.in(state);
    }

    // tslint:disable-next-line:max-line-length
    public on<TPayload extends ActionPayload>(actionFunc: ActionDefinition<TPayload>): ActionFluentOptions<TState, TPayload> {
        return this.stateOptions.on(actionFunc);
    }
}
