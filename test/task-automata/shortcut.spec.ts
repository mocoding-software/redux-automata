import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, createTaskAtuomation } from "../../src";

interface Data {
    message: string;
}

describe("Shortcut Test", () => {
    const promise = new Promise<Data>((ok, cancel) => setTimeout(() => ok({ message: "Expected Message" }), 200));
    const task = () => promise;
    const automation = createTaskAtuomation<Data>("Get Data", task);
    const store = Redux.createStore(automation.reducer, Redux.applyMiddleware(automataMiddleware));

    test("Start Process", () => {
        store.dispatch(automation.start());

        const currentState = store.getState();
        expect(currentState.isProcessing).toBeTruthy();
    });

    test("On Process Completed", () => {
        return promise.then(() => {
            const currentState = store.getState();
            expect(currentState.result.message).toBe("Expected Message"); // this should remaing the same.
        });
    });
});