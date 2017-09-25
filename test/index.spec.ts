import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer } from "../src";

interface ITestState {
    value: string;
}

test("Default", () => {
    const automata = new Automata<ITestState>("Default State");

    const Idle = automata.State("Idle", () => ({ value: null }));
    const Active = automata.State<string>("Active", (state, value) => ({ value }));

    const SetMessage = automata.Action<string>("Set Message");

    automata
        .In(Idle)
            .On(SetMessage)
                .GoTo(Active);

    automata.BeginWith(Idle);

    const reducer = automataReducer(automata);
    const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

    let currentState = store.getState();
    expect(currentState.__sm_state).toBe(Idle.stateName);
    expect(currentState.value).toBe(null);

    store.dispatch(SetMessage("Test"));

    currentState = store.getState();
    expect(currentState.__sm_state).toBe(Active.stateName);
    expect(currentState.value).toBe("Test");
});
