import { IStateFunction, TransitionMethod } from "../common";

/**
 * Node of the graph for finite automata.
 */
export interface INode<TState> {
    entry: IStateFunction<TState>;
    actions: IEdge<TState>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface IEdge<TState> {
    targetState: string;
    actionType: string;
    transitions: TransitionMethod[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface IArc<TState> extends IEdge<TState> {
    sourceState: string;
}

export interface IArcCreator<TState> {
    CreateArcs(): IArc<TState>[];
}
