import {
    IActionOptions,
    IStateFunction,
    IStateMachineOptions,
    IStateOptions,
    IStateOptionsEx,
    TransitionMethod
} from "../common";
import { IArc, IArcCreator } from "./common";
import { StateOptionsEx } from "./StateOptionsEx";

export class ActionOptions<TState, TAction> implements IActionOptions<TState, TAction>, IArcCreator<TState> {

    private transitions: TransitionMethod<TAction>[] = [];
    private targetState: string;

    constructor(
        private sourceStates: string[],
        private actionType: string,
        private smOptions: IStateMachineOptions<TState>,
        private stateOptions: IStateOptions<TState>) { }

    public GoTo(state: IStateFunction<TState, TAction>): IStateOptionsEx<TState> {
        this.targetState = state.stateName;
        return new StateOptionsEx(this.smOptions, this.stateOptions);
    }

    public Execute(transition: TransitionMethod<TAction>): IActionOptions<TState, TAction> {
        this.transitions.push(transition);
        return this;
    }

    public CreateArcs(): IArc<TState>[] {
        const {
            sourceStates,
            actionType,
            targetState,
            transitions
        } = this;

        return sourceStates.map<IArc<TState>>(sourceState => ({
            actionType,
            sourceState,
            targetState,
            transitions,
        }));
    }
}
