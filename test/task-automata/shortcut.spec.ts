import * as Redux from "redux";
import { automataMiddleware, createTaskAutomation } from "../../src";

interface Data {
  message: string;
}

describe("Shortcut Test", () => {
  const promise = new Promise<Data>((accept) => setTimeout(() => accept({ message: "Expected Message" }), 200));
  const task = () => promise;
  const getDataAutomation = createTaskAutomation<Data>("Get Data", task);
  const store = Redux.createStore(getDataAutomation.reducer, Redux.applyMiddleware(automataMiddleware));

  test("Start Process", () => {
    store.dispatch(getDataAutomation.start());

    const currentState = store.getState();
    expect(currentState.isProcessing).toBeTruthy();
  });

  test("On Process Completed", () => {
    return promise.then(() => {
      const currentState = store.getState();
      expect(currentState.result?.message).toBe("Expected Message"); // this should remaing the same.
    });
  });
});
