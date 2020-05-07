/* eslint-disable prettier/prettier */
import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, AutomataState } from "../src";

interface TestState {
  value?: string;
}

describe("Absolute Transitions", () => {
  const automata = new Automata<TestState>("Default State");

  const Idle = automata.state("Idle", () => ({ value: undefined }));
  const Active = automata.state<string>("Active", (state, value) => ({ value }));
  const Other = automata.state<number>("Other", (state, value) => ({ value: value.toString() }));

  const SetMessage = automata.action<string>("Set Message");
  const Cancel = automata.action("Cancel");

  automata
    .in(Idle)
    .or(Active)
    .or(Other)
      .on(SetMessage)
        .goTo(Active)
    .in(Active)
      .on(Cancel)
        .goTo(Idle);


  automata.beginWith(Idle);

  const reducer = automataReducer(automata);
  const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

  test("On Action Test", () => {
    store.dispatch(SetMessage("Test"));

    const currentState = store.getState() as AutomataState<TestState>;
    expect(currentState.__sm_state).toBe(Active.stateName);
    expect(currentState.value).toBe("Test");
  });

  test("On Action 2 Test", () => {
    store.dispatch(SetMessage("Test 2"));

    const currentState = store.getState() as AutomataState<TestState>;
    expect(currentState.__sm_state).toBe(Active.stateName);
    expect(currentState.value).toBe("Test 2"); // this should be updated
  });

  test("On Cancel Test", () => {
    store.dispatch(Cancel());

    const currentState = store.getState() as AutomataState<TestState>;
    expect(currentState.__sm_state).toBe(Idle.stateName);
    expect(currentState.value).toBeUndefined(); // this should be updated
  });
});
