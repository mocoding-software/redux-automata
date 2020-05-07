import {
  ActionDefinition,
  ActionFluentOptions,
  ActionPayload,
  StateDefinition,
  StateFluentOptions,
  StateMachineOptions,
} from "../common";

import { ActionOptions } from "./ActionOptions";
import { Arc, ArcCreator } from "./common";

export class StateOptions<TState> implements StateFluentOptions<TState> {
  private builders: ArcCreator<TState>[] = [];

  constructor(private sourceStates: string[], private smOptions: StateMachineOptions<TState>) {}

  public on<TAction>(action: ActionDefinition<TAction>): ActionFluentOptions<TState, TAction> {
    const builder = new ActionOptions<TState, TAction>(this.sourceStates, action.actionType, this.smOptions, this);
    this.builders.push(builder);
    return builder;
  }

  public or<TOtherState, TPayload extends ActionPayload>(
    state: StateDefinition<TOtherState, TPayload>,
  ): StateFluentOptions<TState> {
    this.sourceStates.push(state.stateName);
    return this;
  }

  public getArcs(): Arc<TState>[] {
    return this.builders.reduce<Arc<TState>[]>((a, b) => a.concat(b.createArcs()), []);
  }
}
