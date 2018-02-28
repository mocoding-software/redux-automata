import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, TransitionMethod } from "../src";

interface TestState {
    processing: boolean;
    value?: string;
}

describe("Transitions With Promise", () => {
    const automata = new Automata<TestState>("Default State");

    // states
    const Idle = automata.state("Idle", () => ({ processing: false }));
    const Processing = automata.state("Processing", () => ({ processing: true }));
    const Completed = automata.state<string>("Completed", (_, value) => ({ processing: false, value }));

    // actions
    const StartProcess = automata.action("Process");
    const EndProcess = automata.action<string>("End");

    let promise: Promise<any>;
    const ProcessData: TransitionMethod<TestState> = dispatch => {
        promise = new Promise<string>((resolve, reject) => setTimeout(() => resolve("Data"), 200))
            .then(data => dispatch(EndProcess(data)));
    };

    automata
        .in(Idle)
            .on(StartProcess)
                .execute(ProcessData)
                .goTo(Processing)
        .in(Processing)
            .on(EndProcess)
                .goTo(Completed);

    automata.beginWith(Idle);

    const reducer = automataReducer(automata);
    const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

    test("Invoke Test", () => {
        store.dispatch(StartProcess());

        const currentState = store.getState();
        expect(currentState.__sm_state).toBe(Processing.stateName);
        expect(currentState.processing).toBeTruthy();
    });

    test("Second Invoke Test", () => {
        store.dispatch(StartProcess());

        const currentState = store.getState();
        expect(currentState.__sm_state).toBe(Processing.stateName);
        expect(currentState.processing).toBeTruthy();
    });

    test("On Promise Completed", () => {
        return promise.then(() => {
            const currentState = store.getState();
            expect(currentState.__sm_state).toBe(Completed.stateName);
            expect(currentState.value).toBe("Data"); // this should remaing the same.
        });
    });
});
