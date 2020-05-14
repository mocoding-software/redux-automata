import { ActionPayload, StateDefinition, TransitionMethod } from "../common";

/**
 * Node of the graph for finite automata.
 */
export interface Node<TState, TPayload extends ActionPayload = void> {
  entry: StateDefinition<TState, TPayload>;
  actions: Edge<TState, TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface Edge<TState, TPayload extends ActionPayload = void> {
  targetState?: string;
  actionType: string;
  transitions: TransitionMethod<TState, TPayload>[];
}

/**
 * Edge between nodes in the finite automata graph
 */
export interface Arc<TState, TPayload extends ActionPayload = void> extends Edge<TState, TPayload> {
  sourceState: string;
}

export interface ArcCreator<TState, TPayload extends ActionPayload = void> {
  createArcs(): Arc<TState, TPayload>[];
}
