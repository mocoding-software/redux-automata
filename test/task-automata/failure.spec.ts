import * as Redux from "redux";
import { automataMiddleware, createTaskAutomation } from "../../src";

interface Data {
  message: string;
}

describe("Failure Test", () => {
  const promise = new Promise<Data>(() => {
    throw new Error("Test");
  });
  const task = () => promise;
  const getDataAutomation = createTaskAutomation<Data>("Get Data", task, undefined, (dispatch, error) =>
    expect(error.message).toBe("Test"),
  );
  const store = Redux.createStore(getDataAutomation.reducer, Redux.applyMiddleware(automataMiddleware));

  test("Default Failure Test", () => {
    store.dispatch(getDataAutomation.start());

    const currentState = store.getState();
    expect(currentState.isProcessing).toBeTruthy();
  });
});
