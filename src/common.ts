import * as Redux from 'redux';

export type IAutomataState<TState> = TState & { __sm_state: string } & ICanInvokeCapabilities;

/**
 * Derive state from this interface to get information on possible action transitions in this state
 */
export interface ICanInvokeCapabilities {
    canInvoke?: <TAction>(action: ActionFunction<TAction>) => boolean;
}

/**
 * Generic action class that contains type, payload and flag
 * to be recognized by StateMachine Middleware.
 */
export interface IAction<TAction> extends Redux.Action {
    __sm__: any;
    payload?: TAction;
    context?: IActionContext;
};

export interface IActionContext{
    dispatch?: Redux.Dispatch<any>
}

/**
 * Function to create state machine actions. Very similar to what ActionCreator is.
 * It is used to define action that could be dispatched and at the same time 
 */
export interface ActionFunction<TAction> {
    actionType?: string,
    (arg: TAction): IAction<TAction>;
}

/**
 * 
 */
export interface StateFunction<TState, TAction> {
    stateName?: string,
    (arg: TAction, state: TState): TState;
}

export interface Transition<TAction> {
    (dispatch: Redux.Dispatch<any>, arg: TAction): void
}

/**
 * Node of the graph for finite automata
*/
export interface Node<TState> {
    stateName: string;
    entry: StateFunction<TState, any>;
    actions: Edge<TState>[];
}
/**
 * Edge between nodes in the finite automata graph
*/
export interface Edge<TState> {
    actionType: string;
    transitions: Transition<any>[];
    targetState: string;
}

export interface IGraphObject<TState> {
    current: IAutomataState<TState>;
    GetGraph: () => Node<TState>[];
}

export interface IStateMachineOptions<TState> {
    In(state: StateFunction<TState, any>): IStateOptions<TState>
}

export interface IStateOptions<TState> {
    On<TAction>(action: ActionFunction<TAction>): IActionOptions<TState, TAction>;
}

export interface IActionOptions<TState, TAction> {
    GoTo(state: StateFunction<TState, TAction>): IStateOptionsEx<TState>;
    Execute(transition: Transition<TAction>): IActionOptions<TState, TAction>;
}

export interface IStateOptionsEx<TState>
    extends IStateOptions<TState>, IStateMachineOptions<TState> { }

export interface INodeBuilder<TState> {
    ToNode(): Node<TState>;
}

export interface IEdgeBuilder<TState> {
    ToEdge(): Edge<TState>;
}