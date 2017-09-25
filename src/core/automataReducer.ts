import * as Redux from "redux";
import {Automata} from "./Automata";
import { ActionPayload, AutomataState, IActionFunction, IContextAction, IGraphObject } from "./common";

export function automataReducer<TState>(automata: Automata<TState>): Redux.Reducer<AutomataState<TState>> {

    if (automata.Initial === undefined)
        throw new Error("No initial state specified. Use BeginWith() method to specify initial state.");

    automata.Current = automata.Initial;

    const nodes = automata.getGraph();
    const currentNode = nodes.find(_ => _.entry.stateName ===  automata.Current.__sm_state);

    if (!currentNode)
        throw new Error("Can't find initial state.");

    automata.Current = Object.assign(automata.Current, {
        canInvoke: <TAction>(action: IActionFunction<TAction>) =>
            currentNode.actions.findIndex(_ => _.actionType === action.actionType) > -1
    });

    return <TPayload extends ActionPayload = undefined>
        (state: AutomataState<TState> = automata.Initial, action: IContextAction<TPayload>) => {
        // skip if not state machine;
        if (!action.context)
            return state;

        const node = nodes.find(_ => _.entry.stateName === state.__sm_state);
        if (!node)
            return state;

        const stateAction = node.actions.find(_ => _.actionType === action.type);
        if (!stateAction)
            return state;

        const nextNode = nodes.find(_ => _.entry.stateName === stateAction.targetState);
        if (!nextNode)
            throw new Error("Can't find state " + stateAction.targetState);

        automata.Current = state;
        const nextState = nextNode.entry(state, action.payload);
        const canInvoke = <TAction>(actionFunc: IActionFunction<TAction>) =>
            nextNode.actions.findIndex(_ => _.actionType === actionFunc.actionType) > -1;
        const newState: AutomataState<TState> = Object.assign(nextState, {
            __sm_state: nextNode.entry.stateName,
            canInvoke
        });

        stateAction.transitions.forEach(transition =>
            transition(action.context.dispatch, action.payload));

        return newState;
    };
}
