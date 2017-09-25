import { ActionPayload, IStateFunction, TransitionMethod } from "../common";

/**
 * Node of the graph for finite automata.
 */
export interface INode<TState, TPayload extends ActionPayload = undefined> {
    entry: IStateFunction<TState, TPayload>;
    actions: IEdge<TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface IEdge<TPayload extends ActionPayload = undefined> {
    targetState: string;
    actionType: string;
    transitions: TransitionMethod<TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface IArc<TPayload extends ActionPayload = undefined> extends IEdge<TPayload> {
    sourceState: string;
}

export interface IArcCreator<TPayload extends ActionPayload = undefined> {
    CreateArcs(): IArc<TPayload>[];
}
