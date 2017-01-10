import * as Redux from "redux";
import { Automata, automataReducer } from 'redux-automata';

export interface IState{
    message: string;
}

const automata = new Automata<IState>("Counter");
//states
const Off = automata.State("Off", () => ({ message: "Switched Off" }));
const On = automata.State("On", () => ({ message: "Switched On" }));
//actions
const Toggle = automata.Action("Toggle");

automata
    .In(Off)
        .On(Toggle)
            .GoTo(On)
    .In(On)
        .On(Toggle)
            .GoTo(Off);

automata.BeginWith(Off);

const reducer = automataReducer(automata);
export {
    reducer,
    Toggle
}