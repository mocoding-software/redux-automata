import { ActionPayload, StateDefinition, TransitionMethod } from "../common";

/**
 * Node of the graph for finite automata.
 */
export interface Node<TState, TPayload extends ActionPayload = undefined> {
    entry: StateDefinition<TState, TPayload>;
    actions: Edge<TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface Edge<TPayload extends ActionPayload = undefined> {
    targetState?: string;
    actionType: string;
    transitions: TransitionMethod<TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface Arc<TPayload extends ActionPayload = undefined> extends Edge<TPayload> {
    sourceState: string;
}

export interface ArcCreator<TPayload extends ActionPayload = undefined> {
    createArcs(): Arc<TPayload>[];
}
