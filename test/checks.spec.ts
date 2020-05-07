import * as Redux from "redux";
import { Automata, automataReducer } from "../src";

interface TestState {
  value?: string;
}

describe("Checks", () => {
  test("Initial State Check", () => {
    const automata = new Automata<TestState>("Empty");
    expect(() => automataReducer(automata)).toThrowError(
      "No initial state specified. Use BeginWith() method to specify initial state.",
    );
  });

  test("Initial State Check 2", () => {
    const automata = new Automata<TestState>("Empty");
    const Idle = automata.state("Idle", () => ({ value: undefined }));
    const automata2 = new Automata<TestState>("Empty");

    expect(() => automata2.beginWith(Idle)).toThrowError(
      "State should be previously defined using this.state(...) method.",
    );
  });

  test("Duplicate State Check 2", () => {
    const automata = new Automata<TestState>("Empty");
    automata.state("Idle", () => ({ value: undefined }));

    expect(() => automata.state("Idle", () => ({ value: undefined }))).toThrowError(
      "State with the same name already exist: Idle",
    );
  });

  test("Middleware Exist Check", () => {
    jest.useFakeTimers();
    const automata = new Automata<TestState>("Default State");

    const Idle = automata.state("Idle", () => ({ value: undefined }));
    const Active = automata.state<string>("Active", (state, value) => ({ value }));
    const SetMessage = automata.action<string>("Set Message");

    automata.inAny().on(SetMessage).goTo(Active);
    automata.beginWith(Idle);

    const reducer = automataReducer(automata);
    const store = Redux.createStore(reducer);

    expect(() => store.dispatch(SetMessage("Test"))).toThrowError(
      "Dispatch is not defined to perform transitions. It seems `automataMiddleware` was not applied.",
    );
  });
});
