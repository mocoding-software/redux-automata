import * as Redux from "redux";
import { Automata, automataMiddleware, automataReducer } from "../src";

interface ITestState {
    value: string;
}

describe("Switch Transitions", () => {
    const automata = new Automata<ITestState>("Default State");

    // define states
    const Off = automata.State("Off", () => ({ value: "Switched Off" }));
    const On = automata.State("On", () => ({ value: "Switched On" }));

    // define actions
    const Toggle = automata.Action("Toggle");

    // configure state machine
    automata
        .In(Off)
            .On(Toggle)
                .GoTo(On)
        .In(On)
            .On(Toggle)
                .GoTo(Off);

    automata.BeginWith(Off);

    const reducer = automataReducer(automata);
    const store = Redux.createStore(reducer, Redux.applyMiddleware(automataMiddleware));

    test("Toggle On/Off Test", () => {
        store.dispatch(Toggle());

        let currentState = store.getState();
        expect(currentState.__sm_state).toBe(On.stateName);
        expect(currentState.value).toBe("Switched On");
 
        store.dispatch(Toggle());

        currentState = store.getState();
        expect(currentState.__sm_state).toBe(Off.stateName);
        expect(currentState.value).toBe("Switched Off");
    });
});
