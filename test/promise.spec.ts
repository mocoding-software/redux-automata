import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer, TransitionMethod } from "../src";

interface ITestState {
    processing: boolean;
    value?: string;
}

describe("Transitions With Promise", () => {
    const automata = new Automata<ITestState>("Default State");

    // states
    const Idle = automata.State("Idle", () => ({ processing: false }));
    const Processing = automata.State("Processing", () => ({ processing: true }));
    const Completed = automata.State<string>("Completed", (_, value) => ({ processing: false, value }));

    // actions
    const StartProcess = automata.Action("Process");
    const EndProcess = automata.Action<string>("End");

    let promise: Promise<any>;
    const ProcessData: TransitionMethod = dispatch => {
        promise = new Promise<string>((resolve, reject) => setTimeout(() => resolve("Data"), 200))
            .then(data => dispatch(EndProcess(data)));
    };

    automata
        .In(Idle)
            .On(StartProcess)
                .Execute(ProcessData)
                .GoTo(Processing)
        .In(Processing)
            .On(EndProcess)
                .GoTo(Completed);

    automata.BeginWith(Idle);

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
