import * as Redux from "redux";
import { Automata, automataReducer } from "redux-automata";

export interface State{
    message: string;
}

const automata = new Automata<State>("Counter");
// states
const Off = automata.state("Off", () => ({ message: "Switched Off" }));
const On = automata.state("On", () => ({ message: "Switched On" }));
// actions
const Toggle = automata.action("Toggle");

automata
    .in(Off)
        .on(Toggle)
            .goTo(On)
    .in(On)
        .on(Toggle)
            .goTo(Off);

automata.beginWith(Off);

const reducer = automataReducer(automata);
export {
    reducer,
    Toggle
}
