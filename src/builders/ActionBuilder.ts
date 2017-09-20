import { IActionOptions, IEdge, IEdgeBuilder, IStateFunction, IStateOptionsEx, Transition } from "../common";
import { StateBuilder } from "./StateBuilder";
import { StateBuilderEx } from "./StateBuilderEx";

export class ActionBuilder<TState, TAction> implements IActionOptions<TState, TAction>, IEdgeBuilder<TState> {

    private transitions: Transition<TAction>[] = [];
    private targetState: string;

    constructor(public name: string, public builder: StateBuilder<TState>) {

    }

    public GoTo(state: IStateFunction<TState, TAction>): IStateOptionsEx<TState> {
        this.targetState = state.stateName;
        return new StateBuilderEx(this.builder);
    }

    public Execute(transition: Transition<TAction>): IActionOptions<TState, TAction> {
        this.transitions.push(transition);
        return this;
    }

    public ToEdge(): IEdge<TState> {
        return {
            actionType: this.name,
            targetState: this.targetState,
            transitions: this.transitions
        };
    }
}
