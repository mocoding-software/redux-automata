import * as Redux from "redux"
import { IGraphObject, IAutomataState, IAction, ActionFunction } from './common';

export function automataReducer<TState>(automata: IGraphObject<TState>): Redux.Reducer<IAutomataState<TState>> {

    const nodes = automata.GetGraph();
    var currentNode = nodes.find(_ => _.stateName ==  automata.current.__sm_state);
    if (automata.current === undefined)
        throw new Error("No initial state specified. Use StartWith() method to specify initial state.")
    automata.current = Object.assign(automata.current, {
        canInvoke: <TAction>(action: ActionFunction<TAction>) => currentNode.actions.findIndex(_=>_.actionType == action.actionType) > -1
    }); 

    return (state: IAutomataState<TState> = automata.current, action: IAction<TState>) => {        
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
        
        automata.current = state;
        let nextState = nextNode.entry(action.payload, state);
        let canInvoke = <TAction>(action: ActionFunction<TAction>) => nextNode.actions.findIndex(_=>_.actionType == action.actionType) > -1       
        let newState: IAutomataState<TState> = Object.assign(nextState, {
            __sm_state: nextNode.stateName,
            canInvoke
        });

        stateAction.transitions.forEach(transition =>
            transition(action.context.dispatch, action.payload));

        return newState;
    }
}