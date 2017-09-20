import { IActionFunction, IActionOptions, IStateFunction, IStateOptions, IStateOptionsEx } from "../common";
import { StateBuilder } from "./StateBuilder";

export class StateBuilderEx<TState> implements IStateOptionsEx<TState> {
    constructor(private builder: StateBuilder<TState>) { }

    public In(state: IStateFunction<TState, any>): IStateOptions<TState> {
        return this.builder.machine.In(state);
    }

    public On<TAction>(actionFunc: IActionFunction<TAction>): IActionOptions<TState, TAction> {
        return this.builder.On(actionFunc);
    }
}