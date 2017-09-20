import * as Redux from "redux";

export type AutomataState<TState> = TState & { __sm_state: string } & ICanInvokeCapabilities;

/**
 * Derive state from this interface to get information on possible action transitions in this state
 */
export interface ICanInvokeCapabilities {
    canInvoke?: <TAction>(action: IActionFunction<TAction>) => boolean;
}

/**
 * Generic action class that contains type, payload and flag
 * to be recognized by StateMachine Middleware.
 */
export interface IAction<TAction> extends Redux.Action {
    __sm__?: any;
    payload?: TAction;
    context?: IActionContext;
}

export interface IActionContext {
    dispatch?: Redux.Dispatch<any>;
}

/**
 * Function to create state machine actions. Very similar to what ActionCreator is.
 * It is used to define action that could be dispatched and at the same time.
 */
export interface IActionFunction<TAction> {
    actionType?: string;
    (arg: TAction): IAction<TAction>;
}

/**
 * Typed Reducer method aka extends Redux.Reducer<TState>
 */
export interface IStateFunction<TState, TAction> {
    stateName?: string;
    (state: TState, arg: TAction): TState;
}

export type Transition<TAction> = (dispatch: Redux.Dispatch<any>, arg: TAction) => void;

/**
 * Node of the graph for finite automata.
 */
export interface INode<TState> {
    stateName: string;
    entry: IStateFunction<TState, any>;
    actions: IEdge<TState>[];
}
/**
 * Edge between nodes in the finite automata graph
 */
export interface IEdge<TState> {
    actionType: string;
    transitions: Transition<any>[];
    targetState: string;
}

export interface IGraphObject<TState> {
    Initial: AutomataState<TState>;
    Current: AutomataState<TState>;
    GetGraph: () => INode<TState>[];
}

export interface IStateMachineOptions<TState> {
    In(state: IStateFunction<TState, any>): IStateOptions<TState>;
}

export interface IStateOptions<TState> {
    On<TAction>(action: IActionFunction<TAction>): IActionOptions<TState, TAction>;
}

export interface IActionOptions<TState, TAction> {
    GoTo(state: IStateFunction<TState, TAction>): IStateOptionsEx<TState>;
    Execute(transition: Transition<TAction>): IActionOptions<TState, TAction>;
}

export interface IStateOptionsEx<TState>
    extends IStateOptions<TState>, IStateMachineOptions<TState> { }

export interface INodeBuilder<TState> {
    ToNode(): INode<TState>;
}

export interface IEdgeBuilder<TState> {
    ToEdge(): IEdge<TState>;
}
