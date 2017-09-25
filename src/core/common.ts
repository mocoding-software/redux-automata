import * as Redux from "redux";

export type AutomataState<TState> = TState & { __sm_state: string | undefined } & ICanInvokeCapabilities;

export const ACTION_TYPE_PREFIEX = "@@AUTOMATA";

/**
 * Payload type
 */
export type ActionPayload = any;

/**
 * Derive state from this interface to get information on possible action transitions in this state
 */
export interface ICanInvokeCapabilities {
    canInvoke?: <TPayload extends ActionPayload = undefined>(action: IActionFunction<TPayload>) => boolean;
}

/**
 * Generic action class that contains type and payload.
 */
export interface IPayloadAction<TPayload extends ActionPayload = undefined> extends Redux.Action {
    payload?: TPayload;
}

/**
 * Action with context to be processed by automata reducer.
 */
export interface IContextAction<TPayload extends ActionPayload = undefined> extends IPayloadAction<TPayload> {
    context: IActionContext;
}

export interface IActionContext {
    dispatch: Redux.Dispatch<any>;
}

/**
 * Function to create state machine actions. Very similar to what ActionCreator is.
 * It is used to define action that could be dispatched and at the same time.
 */
export interface IActionFunction<TPayload extends ActionPayload = undefined> {
    actionType: string;
    (arg: TPayload): IPayloadAction<TPayload>;
}

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export type TypedReducer<TState, TPayload extends ActionPayload = undefined> = (state: TState, arg: TPayload) => TState;

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export interface IStateFunction
    <TState, TPayload extends ActionPayload = undefined> extends TypedReducer<TState, TPayload> {

    stateName: string;
}

export type TransitionMethod<TPayload extends ActionPayload = undefined>
    = (dispatch: Redux.Dispatch<any>, arg: TPayload) => void;

export interface IGraphObject<TState> {
    Initial: AutomataState<TState>;
    Current: AutomataState<TState>;
    // GetGraph: () => INode<TState>[];
}

export interface IStateMachineOptions<TState> {
    In(state: IStateFunction<TState>): IStateOptions<TState>;
    InAny(): IStateOptions<TState>;
}

export interface IStateOptions<TState> {
    On<TPayload extends ActionPayload>(action: IActionFunction<TPayload>): IActionOptions<TState, TPayload>;
}

export interface IActionOptions<TState, TPayload extends ActionPayload> {
    GoTo(state: IStateFunction<TState, TPayload>): IStateOptionsEx<TState>;
    Execute(transition: TransitionMethod<TPayload>): IActionOptions<TState, TPayload>;
}

export interface IStateOptionsEx<TState>
    extends IStateOptions<TState>, IStateMachineOptions<TState> { }
