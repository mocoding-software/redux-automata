import { ActionFunction } from './common';
import { IStateMachineOptions, StateFunction, IStateOptions, IAutomataState, IGraphObject, Node } from './common';
export declare class Automata<TState> implements IStateMachineOptions<TState>, IGraphObject<TState> {
    protected automataName: string;
    initial: IAutomataState<TState>;
    current: IAutomataState<TState>;
    private builders;
    constructor(automataName: string);
    In(state: StateFunction<TState, any>): IStateOptions<TState>;
    BeginWith(state: StateFunction<TState, {}>): void;
    GetGraph(): Node<TState>[];
    State<TAction>(name: string, func: StateFunction<TState, TAction>): StateFunction<TState, TAction>;
    Action<TActionPayload>(type: string): ActionFunction<TActionPayload>;
    protected mergeState(state: TState): TState;
}
