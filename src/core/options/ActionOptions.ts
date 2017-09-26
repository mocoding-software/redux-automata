import {
    ActionPayload,
    ActionFluentOptions,
    StateDefinition,
    StateMachineOptions,
    StateFluentOptions,
    StateFluetOptionsEx,
    TransitionMethod
} from "../common";
import { Arc, ArcCreator } from "./common";
import { StateOptionsEx } from "./StateOptionsEx";

export class ActionOptions<TState, TAction> implements ActionFluentOptions<TState, TAction>, ArcCreator<TState> {

    private transitions: TransitionMethod<TAction>[] = [];
    private targetState: string;

    constructor(
        private sourceStates: string[],
        private actionType: string,
        private smOptions: StateMachineOptions<TState>,
        private stateOptions: StateFluentOptions<TState>) { }

    public goTo(state: StateDefinition<TState, TAction>): StateFluetOptionsEx<TState> {
        this.targetState = state.stateName;
        return new StateOptionsEx(this.smOptions, this.stateOptions);
    }

    public execute(transition: TransitionMethod<TAction>): ActionFluentOptions<TState, TAction> {
        this.transitions.push(transition);
        return this;
    }

    public createArcs(): Arc<ActionPayload>[] {
        const {
            sourceStates,
            actionType,
            targetState,
            transitions
        } = this;

        return sourceStates.map(sourceState => ({
            actionType,
            sourceState,
            targetState,
            transitions,
        }));
    }
}
