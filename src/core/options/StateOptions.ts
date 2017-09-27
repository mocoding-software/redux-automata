import { ActionDefinition, ActionFluentOptions, StateDefinition, StateMachineOptions, StateFluentOptions } from "../common";
import { ActionOptions } from "./ActionOptions";
import { Arc, ArcCreator } from "./common";

export class StateOptions<TState> implements StateFluentOptions<TState> {
    private builders: ArcCreator<TState>[] = [];

    constructor(
        private sourceStates: string[],
        private smOptions: StateMachineOptions<TState>) {
    }

    public on<TAction>(action: ActionDefinition<TAction>): ActionFluentOptions<TState, TAction> {
        const builder = new ActionOptions<TState, TAction>(this.sourceStates, action.actionType, this.smOptions, this);
        this.builders.push(builder);
        return builder;
    }

    public or(state: StateDefinition<TState, undefined>): StateFluentOptions<TState> {
        this.sourceStates.push(state.stateName);
        return this;
    }

    public getArcs(): Arc<TState>[] {
        return this.builders.reduce<Arc<TState>[]>((a, b) => a.concat(b.createArcs()), []);
    }
}
