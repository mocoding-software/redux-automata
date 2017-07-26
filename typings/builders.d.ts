import { IStateMachineOptions, IStateOptions, IActionOptions, IStateOptionsEx, INodeBuilder, IEdgeBuilder, ActionFunction, StateFunction, Transition, Node, Edge } from './common';
export declare class StateBuilder<TState> implements IStateOptions<TState>, INodeBuilder<TState> {
    state: StateFunction<TState, any>;
    machine: IStateMachineOptions<TState>;
    builders: IEdgeBuilder<TState>[];
    constructor(state: StateFunction<TState, any>, machine: IStateMachineOptions<TState>);
    On<TAction>(action: ActionFunction<TAction>): IActionOptions<TState, TAction>;
    ToNode(): Node<TState>;
}
export declare class ActionBuilder<TState, TAction> implements IActionOptions<TState, TAction>, IEdgeBuilder<TState> {
    name: string;
    builder: StateBuilder<TState>;
    private transitions;
    private targetState;
    constructor(name: string, builder: StateBuilder<TState>);
    GoTo(state: StateFunction<TState, TAction>): IStateOptionsEx<TState>;
    Execute(transition: Transition<TAction>): IActionOptions<TState, TAction>;
    ToEdge(): Edge<TState>;
}
