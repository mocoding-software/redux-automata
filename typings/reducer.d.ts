import * as Redux from "redux";
import { IGraphObject, IAutomataState } from './common';
export declare function automataReducer<TState>(automata: IGraphObject<TState>): Redux.Reducer<IAutomataState<TState>>;
