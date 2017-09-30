import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, TaskAutomata } from "../../src";

interface Data {
    message: string;
}

describe("Restart Task Automata", () => {
    let promise: Promise<Data>;
    const task = (message: string) => {
        promise = new Promise<Data>((ok, cancel) => setTimeout(() => ok({ message }), 200));
        return promise;
    }
    const automata = new TaskAutomata<Data, string>("Message", task);
    automata.setupProcessIn(automata.Idle);
    automata.beginWith(automata.Idle);

    const reducer = automataReducer(automata);
    const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

    test("Start Process", () => {
        store.dispatch(automata.Start("Expected Message"));

        const currentState = store.getState();
        expect(currentState.__sm_state).toBe(automata.Processing.stateName);
        expect(currentState.isProcessing).toBeTruthy();
    });

    test("Restart", () => {
        return promise.then(() => {
            let currentState = store.getState();
            expect(currentState.__sm_state).toBe(automata.Completed.stateName);
            expect(currentState.result.message).toBe("Expected Message");

            store.dispatch(automata.Restart("Expected Message2"));

            currentState = store.getState();
            expect(currentState.__sm_state).toBe(automata.Processing.stateName);
            expect(currentState.isProcessing).toBeTruthy();
            expect(currentState.result.message).toBe("Expected Message"); // this should remain the same.

            return promise.then(() => {
                currentState = store.getState();
                expect(currentState.__sm_state).toBe(automata.Completed.stateName);
                expect(currentState.result.message).toBe("Expected Message2"); // this should remain the same.
            });
        });
    });
});