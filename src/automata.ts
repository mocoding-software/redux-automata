import { StateBuilder } from './builders';
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

        this.current = Object.assign(state({}), { 
            __sm_state: state.stateName,
            canInvoke: () => false
        });
    }

    public GetGraph(): Node<TState>[] {
        const nodes = this.builders.map(_ => _.ToNode());

        //add hierarchy here?

        return nodes;
    }

    protected mergeState(state: TState): TState {
        let nextState: TState = Object.assign({}, this.current, state);
        return nextState;
    }

    protected state<TAction>(name: string, func: StateFunction<TState, TAction>): StateFunction<TState, TAction> {
        var duplicate = this.builders.find(_ => _.state.stateName === name)
        if (duplicate)
            throw new Error("State with the same name already exist: " + name);
        func.stateName = name;
        var builder = new StateBuilder(func, this);
        this.builders.push(builder);
        return func;
    }
}