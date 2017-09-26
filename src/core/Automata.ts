import {
    ACTION_TYPE_PREFIEX,
    ActionPayload,
    AutomataState,
    IActionFunction,
    IGraphObject,
    IPayloadAction,
    IStateFunction,
    IStateMachineOptions,
    IStateOptions,
    TypedReducer
} from "./common";
import { IArc, IEdge, INode, StateOptions } from "./options";

export class Automata<TState> implements IStateMachineOptions<TState>, IGraphObject<TState> {
    public Initial: AutomataState<TState>;
    public Current: AutomataState<TState>;

    private states: IStateFunction<TState, ActionPayload>[] = [];
    private options: StateOptions<TState>[] = [];

    /**
     *
     */
    constructor(protected automataName: string) {
    }

    public In(state: IStateFunction<TState, ActionPayload>): IStateOptions<TState> {
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

    public State<TActionPayload extends ActionPayload = undefined>(
        name: string,
        reducer: TypedReducer<TState, TActionPayload>): IStateFunction<TState, TActionPayload> {

        const duplicate = this.states.find(_ => _.stateName === name);
        if (duplicate)
            throw new Error("State with the same name already exist: " + name);
        const newState = Object.assign(reducer, { stateName: name });
        this.states.push(newState);

        return newState;
    }

    public Action<TActionPayload extends ActionPayload = undefined>(type: string): IActionFunction<TActionPayload> {
        const actionType = ACTION_TYPE_PREFIEX + " " + this.automataName + " / " + type;

        const func = (payload: TActionPayload) => {
            const action: IPayloadAction<TActionPayload> = {
                payload,
                type: actionType
            };
            return action;
        };

        return Object.assign(func, { actionType });
    }

    public getGraph(): INode<TState, ActionPayload>[] {
        const arcs = this.options.reduce((a, b) => a.concat(b.getArcs()), new Array<IArc<TState>>());

        return this.states.map<INode<TState, ActionPayload>>(entry => {
            let actions = arcs
                .filter(_ => _.sourceState === entry.stateName)
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
