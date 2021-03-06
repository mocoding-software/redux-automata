import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, AutomataState } from "../src";

interface TestState {
  value?: string;
}

describe("Any Transitions", () => {
  const automata = new Automata<TestState>("Default State");

  const Idle = automata.state("Idle", () => ({ value: undefined }));
  const Active = automata.state<string>("Active", (state, value) => ({ value }));

  const SetMessage = automata.action<string>("Set Message");

  automata.inAny().on(SetMessage).goTo(Active);

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
});
