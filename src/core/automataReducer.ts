import * as Redux from "redux";
import { Automata } from "./Automata";
import { ACTION_TYPE_PREFIX, AutomataState, LocalStore } from "./common";

export function automataReducer<TState>(automata: Automata<TState>): Redux.Reducer<TState> {
  if (automata.initial.__sm_state === undefined)
    throw new Error("No initial state specified. Use BeginWith() method to specify initial state.");

  automata.current = automata.initial;

  const nodes = automata.getGraph();
  const currentNode = nodes.find((_) => _.entry.stateName === automata.current.__sm_state);

  if (!currentNode) throw new Error("Can't find initial state.");

  return (state: AutomataState<TState> = automata.initial, action: Redux.AnyAction) => {
    // skip if not state machine;
    if (typeof action.type !== "string" || !action.type.startsWith(ACTION_TYPE_PREFIX)) return state;

    const node = nodes.find((_) => _.entry.stateName === state.__sm_state);
    if (!node) return state;

    const stateAction = node.actions.find((_) => _.actionType === action.type);
    if (!stateAction) return state;

    let newState = state;

    if (stateAction.targetState) {
      const nextNode = nodes.find((_) => _.entry.stateName === stateAction.targetState);
      if (!nextNode) throw new Error("Can't find state " + stateAction.targetState);

      automata.current = state;
      newState = nextNode.entry(state, action.payload);
      newState.__sm_state = nextNode.entry.stateName;
      automata.current = newState;
    }

    if (!action.dispatch) {
      throw new Error("Dispatch is not defined to perform transitions. It seems `automataMiddleware` was not applied.");
    }

    const localStore: LocalStore<TState> = Object.assign(action.dispatch, {
      dispatch: action.dispatch,
      getState: () => automata.current,
    });

    stateAction.transitions.forEach((transition) => transition(localStore, action.payload));

    return newState;
  };
}
