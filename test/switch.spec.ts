/* eslint-disable prettier/prettier */
import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, AutomataState } from "../src";

interface TestState {
  value?: string;
}

describe("Switch Transitions", () => {
  const automata = new Automata<TestState>("Default State");

  // define states
  const Off = automata.state("Off", () => ({ value: "Switched Off" }));
  const On = automata.state("On", () => ({ value: "Switched On" }));

  // define actions
  const Toggle = automata.action("Toggle");

  // configure state machine
  automata
    .in(Off)
      .on(Toggle)
        .goTo(On)
    .in(On)
      .on(Toggle)
        .goTo(Off);

  automata.beginWith(Off);

  const reducer = automataReducer(automata);
  const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

  test("Toggle On/Off Test", () => {
    store.dispatch(Toggle());

    let currentState = store.getState() as AutomataState<TestState>;
    expect(currentState.__sm_state).toBe(On.stateName);
    expect(currentState.value).toBe("Switched On");

    store.dispatch(Toggle());

    currentState = store.getState() as AutomataState<TestState>;
    expect(currentState.__sm_state).toBe(Off.stateName);
    expect(currentState.value).toBe("Switched Off");
  });
});
