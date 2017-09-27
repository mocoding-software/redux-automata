import * as Redux from "redux";
import { Automata } from "./Automata";
import { ActionDefinition, ActionPayload, AutomataAction, AutomataState } from "./common";

export function automataReducer<TState>(automata: Automata<TState>): Redux.Reducer<AutomataState<TState>> {

    if (automata.initial === undefined)
        throw new Error("No initial state specified. Use BeginWith() method to specify initial state.");

    automata.current = automata.initial;

    const nodes = automata.getGraph();
    const currentNode = nodes.find(_ => _.entry.stateName === automata.current.__sm_state);

    if (!currentNode)
        throw new Error("Can't find initial state.");

    automata.current = Object.assign(automata.current, {
        canInvoke: <TAction>(action: ActionDefinition<TAction>) =>
            currentNode.actions.findIndex(_ => _.actionType === action.actionType) > -1
    });

    return <TPayload extends ActionPayload = undefined>
        (state: AutomataState<TState> = automata.initial, action: AutomataAction<TPayload>) => {
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

        automata.current = state;
        const nextState = nextNode.entry(state, action.payload);
        const canInvoke = <TAction>(actionFunc: ActionDefinition<TAction>) =>
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
