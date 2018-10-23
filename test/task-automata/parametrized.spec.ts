import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, AutomataState, TaskAutomata, TaskState } from "../../src";

interface Data {
    message: string;
}

describe("Parametrized Task Automata", () => {
    let promise: Promise<Data>;
    const task = (message: string) => {
        promise = new Promise<Data>((ok, cancel) => setTimeout(() => ok({ message }), 200));
        return promise;
    };
    const automata = new TaskAutomata<Data, string>("Message", task);
    automata.setupProcessIn(automata.Idle);
    automata.beginWith(automata.Idle);

    const reducer = automataReducer(automata);
    const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

    test("Start Process", () => {
        store.dispatch(automata.Start("Expected Message"));

        const currentState = store.getState() as AutomataState<TaskState<Data, Error>>;
        expect(currentState.__sm_state).toBe(automata.Processing.stateName);
        expect(currentState.isProcessing).toBeTruthy();
    });

    test("Second Start Process Test", () => {
        store.dispatch(automata.Start("Not Expected Message"));

        const currentState = store.getState() as AutomataState<TaskState<Data, Error>>;
        expect(currentState.__sm_state).toBe(automata.Processing.stateName);
        expect(currentState.isProcessing).toBeTruthy();
    });

    test("On Process Completed", () => {
        return promise.then(() => {
            const currentState = store.getState() as AutomataState<TaskState<Data, Error>>;
            expect(currentState.__sm_state).toBe(automata.Completed.stateName);
            expect(currentState.result!.message).toBe("Expected Message"); // this should remaing the same.
        });
    });
});
