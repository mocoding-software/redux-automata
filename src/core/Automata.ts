import {
  ACTION_TYPE_PREFIX,
  ActionDefinition,
  ActionPayload,
  AutomataState,
  PayloadAction,
  StateDefinition,
  StateFluentOptions,
  StateMachineOptions,
  TypedReducer,
} from "./common";
import { Arc, Edge, Node, StateOptions } from "./options";

export class Automata<TState> implements StateMachineOptions<TState> {
  public initial: AutomataState<TState>;
  public current: AutomataState<TState>;

  private states: StateDefinition<TState, ActionPayload>[] = [];
  private options: StateOptions<TState>[] = [];

  /**
   *
   */
  constructor(protected automataName: string) {
    this.initial = Object.assign({});
    this.current = this.initial;
  }

  public in(state: StateDefinition<TState, ActionPayload>): StateFluentOptions<TState> {
    const existingState = this.states.find((_) => _.stateName === state.stateName);
    if (!existingState) throw new Error("State should be defined using this.state(...) method.");

    const option = new StateOptions([existingState.stateName], this);
    this.options.push(option);
    return option;
  }

  public inAny(): StateFluentOptions<TState> {
    const option = new StateOptions(
      this.states.map((_) => _.stateName),
      this,
    );
    this.options.push(option);
    return option;
  }

  public beginWith(state: StateDefinition<TState>): void {
    const existingState = this.states.find((_) => _.stateName === state.stateName);
    if (!existingState) throw new Error("State should be previously defined using this.state(...) method.");

    this.initial = Object.assign(state({} as TState, undefined), {
      // eslint-disable-next-line @typescript-eslint/camelcase
      __sm_state: existingState.stateName,
      canInvoke: () => false,
    });
  }

  public state<TActionPayload extends ActionPayload = undefined>(
    name: string,
    reducer: TypedReducer<TState, TActionPayload>,
  ): StateDefinition<TState, TActionPayload> {
    const duplicate = this.states.find((_) => _.stateName === name);
    if (duplicate) throw new Error("State with the same name already exist: " + name);
    const newState = Object.assign(reducer, { stateName: name });
    this.states.push(newState);

    return newState;
  }

  public action<TActionPayload extends ActionPayload = undefined>(type: string): ActionDefinition<TActionPayload> {
    const actionType = ACTION_TYPE_PREFIX + " " + this.automataName + " / " + type;

    const func: (payload?: TActionPayload) => PayloadAction<TActionPayload> = (payload?: TActionPayload) => {
      const action: PayloadAction<TActionPayload> = {
        payload,
        type: actionType,
      };
      return action;
    };

    return Object.assign(func, { actionType });
  }

  public getGraph(): Node<TState, ActionPayload>[] {
    const arcs = this.options.reduce((a, b) => a.concat(b.getArcs()), new Array<Arc<TState, ActionPayload>>());

    return this.states.map<Node<TState, ActionPayload>>((entry) => {
      let actions = arcs
        .filter((_) => _.sourceState === entry.stateName)
        .map<Edge<TState, ActionPayload>>((_) => ({
          actionType: _.actionType,
          targetState: _.targetState,
          transitions: _.transitions,
        }));

      // remove duplicates
      actions = actions.filter((_, i) => actions.findIndex((a) => a.actionType === _.actionType) === i);

      return {
        actions,
        entry,
      };
    });
  }

  protected mergeState(state: TState): TState {
    const nextState: TState = Object.assign({}, this.current, state);
    return nextState;
  }
}
