import * as Redux from "redux";
import { Automata } from "./Automata";
import {
  ACTION_TYPE_PREFIX,
  ActionDefinition,
  ActionPayload,
  AutomataState,
  LocalStore,
  CanInvokeFunction,
} from "./common";

export function automataReducer<TState>(automata: Automata<TState>): Redux.Reducer<TState> {
  if (automata.initial.__sm_state === undefined)
    throw new Error("No initial state specified. Use BeginWith() method to specify initial state.");

  automata.current = automata.initial;

  const nodes = automata.getGraph();
  const currentNode = nodes.find((_) => _.entry.stateName === automata.current.__sm_state);

  if (!currentNode) throw new Error("Can't find initial state.");

  automata.current = Object.assign(automata.current, {
    canInvoke: <TAction>(action: ActionDefinition<TAction>) =>
      currentNode.actions.findIndex((_) => _.actionType === action.actionType) > -1,
  });

  return <TPayload extends ActionPayload>(state: AutomataState<TState> = automata.initial, action: Redux.AnyAction) => {
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
      const nextState = nextNode.entry(state, action.payload);
      const canInvoke: CanInvokeFunction = <TAction>(actionFunc: ActionDefinition<TAction>) =>
        nextNode.actions.findIndex((_) => _.actionType === actionFunc.actionType) > -1;
      newState = Object.assign(nextState, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        __sm_state: nextNode.entry.stateName,
        canInvoke,
      });
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
