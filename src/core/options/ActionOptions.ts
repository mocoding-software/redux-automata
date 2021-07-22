import {
  ActionFluentOptions,
  ActionPayload,
  StateDefinition,
  StateFluentOptions,
  StateFluentOptionsEx,
  StateMachineOptions,
  TransitionMethod,
} from "../common";
import { Arc, ArcCreator } from "./common";
import { StateOptionsEx } from "./StateOptionsEx";

export class ActionOptions<TState, TAction>
  implements ActionFluentOptions<TState, TAction>, ArcCreator<TState, TAction>
{
  private transitions: TransitionMethod<TState, TAction>[] = [];
  private targetState?: string;

  constructor(
    private sourceStates: string[],
    private actionType: string,
    private smOptions: StateMachineOptions<TState>,
    private stateOptions: StateFluentOptions<TState>,
  ) {}

  public goTo(state: StateDefinition<TState, TAction>): StateFluentOptionsEx<TState> {
    this.targetState = state.stateName;
    return new StateOptionsEx(this.smOptions, this.stateOptions);
  }

  public execute(transition: TransitionMethod<TState, TAction>): ActionFluentOptions<TState, TAction> {
    this.transitions.push(transition);
    return this;
  }

  public noop(): StateFluentOptionsEx<TState> {
    return new StateOptionsEx(this.smOptions, this.stateOptions);
  }

  public createArcs(): Arc<TState, ActionPayload>[] {
    const { sourceStates, actionType, targetState, transitions } = this;

    return sourceStates.map((sourceState) => ({
      actionType,
      sourceState,
      targetState,
      transitions,
    }));
  }
}
