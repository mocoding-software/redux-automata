import { ActionPayload, StateDefinition, TransitionMethod } from "../common";

/**
 * Node of the graph for finite automata.
 */
export interface Node<TState, TPayload extends ActionPayload = undefined> {
  entry: StateDefinition<TState, TPayload>;
  actions: Edge<TState, TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface Edge<TState, TPayload extends ActionPayload = undefined> {
  targetState?: string;
  actionType: string;
  transitions: TransitionMethod<TState, TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface Arc<TState, TPayload extends ActionPayload = undefined> extends Edge<TState, TPayload> {
  sourceState: string;
}

export interface ArcCreator<TState, TPayload extends ActionPayload = undefined> {
  createArcs(): Arc<TState, TPayload>[];
}
