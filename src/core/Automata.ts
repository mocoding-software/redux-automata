import {
    AutomataState,
    IAction,
    IActionFunction,
    IGraphObject,
    IStateFunction,
    IStateMachineOptions,
    IStateOptions,
    TypedReducer
} from "./common";
import { IArc, IEdge, INode, StateOptions } from "./options";

export class Automata<TState> implements IStateMachineOptions<TState>, IGraphObject<TState> {
    public Initial: AutomataState<TState>;
    public Current: AutomataState<TState>;

    private states: IStateFunction<TState, any>[] = [];
    private options: StateOptions<TState>[] = [];

    /**
     *
     */
    constructor(protected automataName: string) {
    }

    public In(state: IStateFunction<TState, any>): IStateOptions<TState> {
        const existingState = this.states.find(_ => _.stateName === state.stateName);
        if (!existingState)
            throw new Error("State should be defined using this.state(...) method.");

        const option = new StateOptions([existingState.stateName], this);
        this.options.push(option);
        return option;
    }

    public InAny(): IStateOptions<TState> {
        const option = new StateOptions(this.states.map(_ => _.stateName), this);
        this.options.push(option);
        return option;
    }

    public BeginWith(state: IStateFunction<TState, {}>) {
        const existingState = this.states.find(_ => _.stateName === state.stateName);
        if (!existingState)
            throw new Error("State should be previously defined using this.state(...) method.");

        this.Initial = Object.assign(state({} as TState, {}), {
            __sm_state: existingState.stateName,
            canInvoke: () => false
        });
    }

    public State<TAction>(name: string, reducer: TypedReducer<TState, TAction>): IStateFunction<TState, TAction> {
        const duplicate = this.states.find(_ => _.stateName === name);
        if (duplicate)
            throw new Error("State with the same name already exist: " + name);
        const newState = Object.assign({}, reducer, { stateName: name }) as IStateFunction<TState, TAction>;
        this.states.push(newState);

        return newState;
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

    public getGraph(): INode<TState>[] {
        const arcs = this.options.reduce((a, b) => a.concat(b.getArcs()), new Array<IArc<TState>>());

        return this.states.map<INode<TState>>(entry => {
            let actions = arcs
                .filter(_ => _.sourceState === entry.name)
                .map<IEdge<TState>>(_ => ({
                    actionType: _.actionType,
                    targetState: _.targetState,
                    transitions: _.transitions,
                }));

            // remove duplicates
            actions = actions.filter((_, i) => actions.findIndex(a => a.actionType === _.actionType) === i);

            return {
                actions,
                entry,
            };
        });
    }

    protected mergeState(state: TState): TState {
        const nextState: TState = Object.assign({}, this.Current, state);
        return nextState;
    }
}
