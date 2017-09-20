import { StateBuilder } from "./builders";
import { IAction, IActionFunction } from "./common";

import {
    AutomataState,
    IGraphObject,
    INode,
    IStateFunction,
    IStateMachineOptions,
    IStateOptions
} from "./common";

export class Automata<TState> implements IStateMachineOptions<TState>, IGraphObject<TState> {

    public Initial: AutomataState<TState>;
    public Current: AutomataState<TState>;

    private builders: StateBuilder<TState>[] = [];

    /**
     *
     */
    constructor(protected automataName: string) {
    }

    public In(state: IStateFunction<TState, any>): IStateOptions<TState> {
        const builder = this.builders.find(_ => _.state.stateName === state.stateName);
        if (!builder)
            throw new Error("State should be defined using this.state(...) method.");

        return builder;
    }

    public BeginWith(state: IStateFunction<TState, {}>) {
        const builder = this.builders.find(_ => _.state.stateName === state.stateName);
        if (!builder)
            throw new Error("State should be previously defined using this.state(...) method.");

        this.Initial = Object.assign(state({} as TState, {}), {
            __sm_state: state.stateName,
            canInvoke: () => false
        });
    }

    public GetGraph(): INode<TState>[] {
        const nodes = this.builders.map(_ => _.ToNode());

        // add hierarchy here?

        return nodes;
    }

    public State<TAction>(name: string, func: IStateFunction<TState, TAction>): IStateFunction<TState, TAction> {
        const duplicate = this.builders.find(_ => _.state.stateName === name);
        if (duplicate)
            throw new Error("State with the same name already exist: " + name);
        func.stateName = name;
        const builder = new StateBuilder(func, this);
        this.builders.push(builder);
        return func;
    }

    public Action<TActionPayload>(type: string) {
        const actionType = this.automataName + "/" + type;

        const func: IActionFunction<TActionPayload> = (payload: TActionPayload) => {
            const action: IAction<TActionPayload> = {
                __sm__: this.automataName,
                payload,
                type: actionType
            };
            return action;
        };

        func.actionType = type;
        return func;
    }

    protected mergeState(state: TState): TState {
        const nextState: TState = Object.assign({}, this.Current, state);
        return nextState;
    }
}
