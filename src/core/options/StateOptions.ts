import { IActionFunction, IActionOptions, IStateMachineOptions, IStateOptions } from "../common";
import { ActionOptions } from "./ActionOptions";
import { IArc, IArcCreator } from "./common";

export class StateOptions<TState> implements IStateOptions<TState> {
    private builders: IArcCreator<TState>[] = [];

    constructor(
        private sourceStates: string[],
        private smOptions: IStateMachineOptions<TState>) {
    }

    public On<TAction>(action: IActionFunction<TAction>): IActionOptions<TState, TAction> {
        const builder = new ActionOptions<TState, TAction>(this.sourceStates, action.actionType, this.smOptions, this);
        this.builders.push(builder);
        return builder;
    }

    public getArcs(): IArc<TState>[] {
        return this.builders.reduce<IArc<TState>[]>((a, b) => a.concat(b.CreateArcs()), []);
    }
}
