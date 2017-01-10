import { StateBuilder } from './builders';
import { ActionFunction, IAction } from './common';

import {
    IStateMachineOptions,
    StateFunction,
    IStateOptions,
    IAutomataState,
    IGraphObject,
    Node
} from './common';


export class Automata<TState> implements IStateMachineOptions<TState>, IGraphObject<TState> {

    current: IAutomataState<TState>;
    private builders: StateBuilder<TState>[] = [];

    /**
     *
     */
    constructor(protected automataName: string) {
        
        
    }

    In(state: StateFunction<TState, any>): IStateOptions<TState> {
        var builder = this.builders.find(_ => _.state.stateName === state.stateName)
        if (!builder)
            throw new Error("State should be defined using this.state(...) method.");

        return builder;
    }

    BeginWith(state: StateFunction<TState, {}>) {
        var builder = this.builders.find(_ => _.state.stateName === state.stateName)
        if (!builder)
            throw new Error("State should be previously defined using this.state(...) method.");

        this.current = Object.assign(state({} as TState, {}), { 
            __sm_state: state.stateName,
            canInvoke: () => false
        });
    }

    public GetGraph(): Node<TState>[] {
        const nodes = this.builders.map(_ => _.ToNode());

        //add hierarchy here?

        return nodes;
    }    

    public State<TAction>(name: string, func: StateFunction<TState, TAction>): StateFunction<TState, TAction> {
        var duplicate = this.builders.find(_ => _.state.stateName === name)
        if (duplicate)
            throw new Error("State with the same name already exist: " + name);
        func.stateName = name;
        var builder = new StateBuilder(func, this);
        this.builders.push(builder);
        return func;
    }

    public Action<TActionPayload>(type: string) {
        var type = this.automataName + "/" + type;

        var func: ActionFunction<TActionPayload> = (payload: TActionPayload) => {
            let action: IAction<TActionPayload> = {
                __sm__: this.automataName,
                type: type,
                payload: payload
            };
            return action;
        }

        func.actionType = type;
        return func;
    }

    protected mergeState(state: TState): TState {
        let nextState: TState = Object.assign({}, this.current, state);
        return nextState;
    }
}