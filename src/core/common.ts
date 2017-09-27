import * as Redux from "redux";

export type AutomataState<TState> = TState & { __sm_state: string | undefined } & CanInvokeCapabilities;

export const ACTION_TYPE_PREFIEX = "@@AUTOMATA";

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
export interface PayloadAction<TPayload extends ActionPayload = undefined> extends Redux.Action {
    payload?: TPayload;
}

/**
 * Action with context to be processed by automata reducer.
 */
export interface AutomataAction<TPayload extends ActionPayload = undefined> extends PayloadAction<TPayload> {
    context: ActionContext;
}

export interface ActionContext {
    dispatch: Redux.Dispatch<any>;
}

/**
 * Function to create state machine actions. Very similar to what ActionCreator is.
 * It is used to define action that could be dispatched and at the same time.
 */
export interface ActionDefinition<TPayload extends ActionPayload = undefined> {
    actionType: string;
    (arg?: TPayload): PayloadAction<TPayload>;
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

export type TransitionMethod<TPayload extends ActionPayload = undefined>
    = (dispatch: Redux.Dispatch<any>, arg: TPayload) => void;

export interface StateMachineOptions<TState> {
    in(state: StateDefinition<TState>): StateFluentOptions<TState>;
    inAny(): StateFluentOptions<TState>;
}

export interface StateFluentOptions<TState> {
    on<TPayload extends ActionPayload>(action: ActionDefinition<TPayload>): ActionFluentOptions<TState, TPayload>;
    or(state: StateDefinition<TState>): StateFluentOptions<TState>;
}

export interface ActionFluentOptions<TState, TPayload extends ActionPayload> {
    goTo(state: StateDefinition<TState, TPayload>): StateFluetOptionsEx<TState>;
    execute(transition: TransitionMethod<TPayload>): ActionFluentOptions<TState, TPayload>;
}

export interface StateFluetOptionsEx<TState> {
    in(state: StateDefinition<TState>): StateFluentOptions<TState>;
    on<TPayload extends ActionPayload>(action: ActionDefinition<TPayload>): ActionFluentOptions<TState, TPayload>;
 }
