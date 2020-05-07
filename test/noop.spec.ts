/* eslint-disable prettier/prettier */
import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, AutomataState } from "../src";

interface TestState {
  value?: string;
}

describe("Noop", () => {
  const automata = new Automata<TestState>("Default State");

  const Idle = automata.state("Idle", () => ({ value: undefined }));
  const SetMessage = automata.action<string>("Set Message");
  const UpdateMessage = automata.action("Update Message");
  const Noop = automata.action("Noop");

  const Active = automata.state<string>("Active", (state, value) => ({ value }));

  automata
    .in(Idle)
      .on(Noop)
        .noop()
      .on(SetMessage)
        .goTo(Active)
      .on(UpdateMessage)
        .execute((dispatch) => dispatch(SetMessage("test")))
        .noop();

  automata.beginWith(Idle);

  const reducer = automataReducer(automata);
  const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

  test("Idle Test", () => {
    const currentState = store.getState() as AutomataState<TestState>;
    expect(currentState.__sm_state).toBe(Idle.stateName);
    expect(currentState.value).toBeUndefined();
  });

  test("On Noop Test", () => {
    store.dispatch(Noop());
    const currentState = store.getState() as AutomataState<TestState>;
    expect(currentState.__sm_state).toBe(Idle.stateName);
  });

  test("On Execute Test", () => {
    store.dispatch(UpdateMessage());

    return new Promise((accept) => setTimeout(accept, 1)).then(() => {
      const currentState = store.getState() as AutomataState<TestState>;
      expect(currentState.__sm_state).toBe(Active.stateName);
    });
  });
});
