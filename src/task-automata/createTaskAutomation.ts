import * as Redux from "redux";
import { ActionDefinition, automataReducer, AutomataState } from "../core";
import { Task, TaskComplete, TaskState } from "./common";
import { TaskAutomata } from "./TaskAutomata";

export interface TaskAutomation
    <TResult,
    TInput = undefined,
    TError extends Error = Error,
    TState extends TaskState<TResult, TError> = TaskState<TResult, TError>> {
        reducer: Redux.Reducer<AutomataState<TState>>;
        start: ActionDefinition<TInput>;
        restart: ActionDefinition<TInput>;
        cancel: ActionDefinition;
}

export function createTaskAutomation<
    TResult,
    TInput = undefined,
    TError extends Error = Error,
    TState extends TaskState<TResult, TError> = TaskState<TResult, TError>>(
        dataName: string,
        processTask: Task<TResult, TInput>,
        onSuccess?: TaskComplete<TResult, TInput>,
        onFailure?: TaskComplete<TError, TInput>): TaskAutomation<TResult, TInput, TError, TState> {

    const automata = new TaskAutomata<TResult, TInput, TError, TState>(dataName, processTask, onSuccess, onFailure);
    automata.setupProcessIn(automata.Idle);
    automata.beginWith(automata.Idle);

    const reducer = automataReducer(automata);

    return {
        cancel: automata.Cancel,
        reducer,
        restart: automata.Restart,
        start: automata.Start,
    };
}
