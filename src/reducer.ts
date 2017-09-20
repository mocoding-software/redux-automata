import * as Redux from "redux"
import { IGraphObject, AutomataState, IAction, IActionFunction } from './common';

export function automataReducer<TState>(automata: IGraphObject<TState>): Redux.Reducer<AutomataState<TState>> {

    if (automata.Initial === undefined)
        throw new Error("No initial state specified. Use BeginWith() method to specify initial state.")

    automata.Current = automata.Initial;

    const nodes = automata.GetGraph();
    var currentNode = nodes.find(_ => _.stateName ==  automata.Current.__sm_state);

    automata.Current = Object.assign(automata.Current, {
        canInvoke: <TAction>(action: IActionFunction<TAction>) => currentNode.actions.findIndex(_=>_.actionType == action.actionType) > -1
    }); 

    return (state: AutomataState<TState> = automata.Initial, action: IAction<TState>) => {        
        // skip if not state machine;
        if (action.__sm__ === undefined)
            return state;       

        let node = nodes.find(_ => _.stateName == state.__sm_state)        
        if (!node)
            return state;

        let stateAction = node.actions.find(_ => _.actionType == action.type);
        if (!stateAction)
            return state;

        let nextNode = nodes.find(_ => _.stateName == stateAction.targetState)
        if (!nextNode)
            throw new Error("Can't find state " + stateAction.targetState)
        
        automata.Current = state;
        let nextState = nextNode.entry(state, action.payload);
        let canInvoke = <TAction>(action: IActionFunction<TAction>) => nextNode.actions.findIndex(_=>_.actionType == action.actionType) > -1               
        let newState: AutomataState<TState> = Object.assign(nextState, {
            __sm_state: nextNode.stateName,
            canInvoke
        });

        stateAction.transitions.forEach(transition =>
            transition(action.context.dispatch, action.payload));

        return newState;
    }
}