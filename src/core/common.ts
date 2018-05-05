import * as Redux from "redux";

export type AutomataState<TState> = TState & { __sm_state: string | undefined } & CanInvokeCapabilities;

export const ACTION_TYPE_PREFIX = "@@AUTOMATA";

/**
 * Payload type
 */
export type ActionPayload = any;

/**
 * Derive state from this interface to get information on possible action transitions in this state
 */
export interface CanInvokeCapabilities {
    canInvoke?: <TPayload extends ActionPayload = undefined>(action: ActionDefinition<TPayload>) => boolean;
}

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
    dispatch: Redux.Dispatch;
}

/**
 * Function to create state machine actions. Very similar to what ActionCreator is.
 * It is used to define action that could be dispatched and at the same time.
 */
export interface ActionDefinition<TPayload extends ActionPayload = undefined> {
    actionType: string;
    (payload?: TPayload): PayloadAction<TPayload>;
}

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export type TypedReducer<TState, TPayload extends ActionPayload = undefined> = (state: TState, arg: TPayload) => TState;

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export interface StateDefinition
    <TState, TPayload extends ActionPayload = undefined> extends TypedReducer<TState, TPayload> {
    stateName: string;
}

/**
 * Local store with own getState and Dispatch methods.
 * IMPORTANT: Since version 3.0 `extends Redux.Dispatch<any>` will be removed.
 */
export interface LocalStore<TState> extends Redux.Dispatch<any> {
    dispatch: Redux.Dispatch<any>;
    getState: () => TState;
}

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export interface StateDefinition
    <TState, TPayload extends ActionPayload = undefined> extends TypedReducer<TState, TPayload> {

    stateName: string;
}

export type TransitionMethod<TState, TPayload extends ActionPayload = undefined>
    = (localStore: LocalStore<TState>, arg: TPayload) => void;

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
