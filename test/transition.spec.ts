/* eslint-disable prettier/prettier */
import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, AutomataState, TransitionMethod, PayloadAction } from "../src";

interface RootState {
  process: AutomataState<TestState>;
}

interface TestState {
  processing: boolean;
  canceling?: boolean;
  value?: string;
}

describe("Conditional Transitions", () => {
  const automata = new Automata<AutomataState<TestState>>("Default State");

  // states
  const Idle = automata.state("Idle", () => ({ processing: false }));
  const Processing = automata.state("Processing", () => ({ processing: true }));
  const Canceling = automata.state("Flag", (state) => ({ ...state, canceling: true }));
  const Completed = automata.state<string>("Completed", (_, value) => ({ processing: false, value }));

  // actions
  const StartProcess = automata.action("Process");
  const CancelProcess = automata.action("Cancel Process");
  const EndProcess = automata.action<string>("End");

  let promise: Promise<string | PayloadAction<string>>;
  const ProcessData: TransitionMethod<TestState> = (localStore) => {
    promise = new Promise<string>((resolve) => {
      let clearTimers: () => void = () => {;};
      const completionTimeout = setTimeout(() => {
        clearTimers();
        resolve("Completed");
      }, 1000);
      const checkCanceledInterval = setInterval(() => {
        const state = localStore.getState();
        if (state.canceling) {
          clearTimers();
          resolve("Canceled");
        }
      }, 200);
      clearTimers = () => {
        clearInterval(checkCanceledInterval);
        clearTimeout(completionTimeout);
      };
    }).then((data) => localStore.dispatch(EndProcess(data)));
  };

  automata
    .in(Idle)
      .on(StartProcess)
        .execute(ProcessData)
        .goTo(Processing)
    .in(Processing)
      .on(CancelProcess)
        .goTo(Canceling)
    .in(Processing)
    .or(Canceling)
      .on(EndProcess)
        .goTo(Completed);

  automata.beginWith(Idle);

  const reducer = automataReducer(automata);
  const store = Redux.createStore(
    Redux.combineReducers<RootState>({ process: reducer }),
    Redux.applyMiddleware(automataMiddleware),
  );

  test("Invoke Test", () => {
    store.dispatch(StartProcess());

    const currentState = store.getState().process;
    expect(currentState.__sm_state).toBe(Processing.stateName);
    expect(currentState.processing).toBeTruthy();
  });

  test("Cancel Test", () => {
    store.dispatch(CancelProcess());

    const currentState = store.getState().process;
    expect(currentState.__sm_state).toBe(Canceling.stateName);
    expect(currentState.processing).toBeTruthy();
    expect(currentState.canceling).toBeTruthy();
  });

  test("On Promise Completed", () => {
    return promise.then(() => {
      const currentState = store.getState().process;
      expect(currentState.__sm_state).toBe(Completed.stateName);
      expect(currentState.value).toBe("Canceled"); // this should remaing the same.
    });
  });
});
