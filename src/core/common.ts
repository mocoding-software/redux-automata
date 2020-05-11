import * as Redux from "redux";

export interface InternalProps {
  __sm_state: string;
}

export type AutomataState<TState> = TState & Partial<InternalProps>;

export const ACTION_TYPE_PREFIX = "@@AUTOMATA";

/**
 * Payload type. It can be any type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionPayload = any;

export type IsInvokableFunction = <TState>(state: AutomataState<TState>) => boolean;

/**
 * Generic action class that contains type and payload.
 */
export interface PayloadAction<TPayload extends ActionPayload = undefined> extends Redux.AnyAction {
  payload?: TPayload;
}

/**
 * Action with dispatch to be processed by automata reducer.
 */
export interface AutomataAction<TPayload extends ActionPayload = undefined> extends PayloadAction<TPayload> {
  dispatch: Redux.Dispatch<AutomataAction<TPayload>>;
}

/**
 * Function to create state machine actions. Very similar to what ActionCreator is.
 * It is used to define action that could be dispatched and at the same time.
 */
export interface ActionDefinition<TPayload extends ActionPayload = undefined> {
  actionType: string;
  isInvokable: IsInvokableFunction;
  (payload?: TPayload): PayloadAction<TPayload>;
}

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export type TypedReducer<TState, TPayload extends ActionPayload = undefined> = (state: TState, arg: TPayload) => TState;

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export interface StateDefinition<TState, TPayload extends ActionPayload = undefined>
  extends TypedReducer<TState, TPayload> {
  stateName: string;
}

/**
 * Local store with own getState and Dispatch methods.
 * IMPORTANT: Since version 3.0 `extends Redux.Dispatch<any>` will be removed.
 */
export interface LocalStore<TState, TAction extends PayloadAction = Redux.AnyAction> extends Redux.Dispatch<TAction> {
  dispatch: Redux.Dispatch<TAction>;
  getState: () => TState;
}

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export interface StateDefinition<TState, TPayload extends ActionPayload = undefined>
  extends TypedReducer<TState, TPayload> {
  stateName: string;
}

export type TransitionMethod<TState, TPayload extends ActionPayload = undefined> = (
  localStore: LocalStore<TState>,
  arg: TPayload,
) => void;

export interface StateMachineOptions<TState> {
  in<TPayload extends ActionPayload>(state: StateDefinition<TState, TPayload>): StateFluentOptions<TState>;
  inAny(): StateFluentOptions<TState>;
}

export interface StateFluentOptions<TState> {
  on<TPayload extends ActionPayload>(action: ActionDefinition<TPayload>): ActionFluentOptions<TState, TPayload>;
  or<TPayload extends ActionPayload>(state: StateDefinition<TState, TPayload>): StateFluentOptions<TState>;
}

export interface ActionFluentOptions<TState, TPayload extends ActionPayload = undefined> {
  goTo(state: StateDefinition<TState, TPayload>): StateFluentOptionsEx<TState>;
  execute(transition: TransitionMethod<TState, TPayload>): ActionFluentOptions<TState, TPayload>;
  noop(): StateFluentOptionsEx<TState>;
}

export interface StateFluentOptionsEx<TState> {
  in<TPayload extends ActionPayload>(state: StateDefinition<TState, TPayload>): StateFluentOptions<TState>;
  on<TPayload extends ActionPayload>(action: ActionDefinition<TPayload>): ActionFluentOptions<TState, TPayload>;
}
